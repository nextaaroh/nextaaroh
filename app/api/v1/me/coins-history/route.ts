import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ACTION_LABELS: Record<string, string> = {
  signup: "Signup Bonus",
  profile_complete: "Profile Complete Bonus",
  daily_login: "Daily Login Bonus",
  streak_bonus: "Streak Bonus",
  referral: "Referral Bonus",
  quiz_participation: "Quiz Participation",
  quiz_correct_answer: "Correct Quiz Answers",
  notes_upload_approved: "Marketplace Upload Approved",
  community_post: "Community Post",
  community_comment: "Community Comment",
  marketplace_sale: "Marketplace Sale",
  daily_learning_viewed: "Daily Learning Viewed",
  daily_quote_viewed: "Daily Quote Viewed",
  influencer_milestone: "Influencer Milestone",
  redemption: "Converted to Wallet",
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const { data: ledger } = await supabase
    .from("points_ledger")
    .select("id, action, points, note, created_at")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: payouts } = await supabase
    .from("seller_payouts")
    .select("id, amount_paise, status, requested_at, processed_at")
    .eq("seller_id", user.id)
    .order("requested_at", { ascending: false });

  const coinEvents = (ledger ?? []).map((row) => ({
    type: "coins" as const,
    id: row.id,
    label: ACTION_LABELS[row.action] ?? row.action,
    amount: row.points,
    note: row.note,
    date: row.created_at,
  }));

  const withdrawalEvents = (payouts ?? []).map((row) => ({
    type: "withdrawal" as const,
    id: row.id,
    label: "Withdrawal Request",
    amount: row.amount_paise,
    status: row.status,
    date: row.requested_at,
  }));

  const combined = [...coinEvents, ...withdrawalEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return NextResponse.json({ data: combined });
}
