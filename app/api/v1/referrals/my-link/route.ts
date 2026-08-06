import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("referral_code").eq("id", user.id).single();

  const { count } = await admin
    .from("referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", user.id)
    .eq("reward_granted", true);

  const { data: pointsRows } = await admin
    .from("points_ledger")
    .select("points")
    .eq("profile_id", user.id)
    .eq("action", "referral");

  const pointsEarned = (pointsRows ?? []).reduce((sum, row) => sum + row.points, 0);

  const origin = new URL(req.url).origin;
  const shareUrl = origin + "/signup?ref=" + (profile?.referral_code ?? "");

  return NextResponse.json({
    referral_code: profile?.referral_code ?? "",
    share_url: shareUrl,
    total_referrals: count ?? 0,
    points_earned: pointsEarned,
  });
}
