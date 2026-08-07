import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MIN_WITHDRAWAL_PAISE = 12900;
const MAX_WITHDRAWAL_PAISE = 150000;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const { amount_paise, method, destination } = body;

  if (!amount_paise || !method || !destination) {
    return NextResponse.json({ error: { code: "validation_error", message: "सारी fields भरें" } }, { status: 400 });
  }

  if (amount_paise < MIN_WITHDRAWAL_PAISE) {
    return NextResponse.json({ error: { code: "below_minimum", message: "कम से कम ₹129 withdraw कर सकते हैं" } }, { status: 400 });
  }

  if (amount_paise > MAX_WITHDRAWAL_PAISE) {
    return NextResponse.json({ error: { code: "above_maximum", message: "एक बार में ज़्यादा से ज़्यादा ₹1500 तक ही withdraw कर सकते हैं" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("wallet_balance_paise").eq("id", user.id).single();

  if (!profile || profile.wallet_balance_paise < amount_paise) {
    return NextResponse.json({ error: { code: "insufficient_balance", message: "आपके wallet में इतना balance नहीं है" } }, { status: 400 });
  }

  const { error } = await admin.from("seller_payouts").insert({
    seller_id: user.id,
    amount_paise,
    status: "requested",
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }

  await admin.rpc("increment_wallet_balance", { p_profile_id: user.id, p_amount_paise: -amount_paise });

  return NextResponse.json({ success: true });
}
