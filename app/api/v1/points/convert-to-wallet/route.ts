import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const POINTS_PER_CONVERSION = 100;
const PAISE_PER_CONVERSION = 500;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const points = Number(body.points);

  if (!points || points < POINTS_PER_CONVERSION || points % POINTS_PER_CONVERSION !== 0) {
    return NextResponse.json(
      { error: { code: "invalid_amount", message: "Points " + POINTS_PER_CONVERSION + " के multiple में होने चाहिए" } },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("points_balance").eq("id", user.id).single();

  if (!profile || profile.points_balance < points) {
    return NextResponse.json({ error: { code: "insufficient_points", message: "इतने points आपके पास नहीं हैं" } }, { status: 400 });
  }

  const paise = (points / POINTS_PER_CONVERSION) * PAISE_PER_CONVERSION;

  await admin.from("points_ledger").insert({
    profile_id: user.id,
    action: "redemption",
    points: -points,
    note: "Converted to wallet",
  });
  await admin.rpc("decrement_points_balance", { p_profile_id: user.id, p_points: points });
  await admin.rpc("increment_wallet_balance", { p_profile_id: user.id, p_amount_paise: paise });

  return NextResponse.json({ success: true, converted_paise: paise });
}
