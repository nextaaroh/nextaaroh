import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MILESTONES = [
  { count: 25, reward: "NextAaroh Official T-Shirt" },
  { count: 40, reward: "Shoes + T-Shirt + Track Pants" },
  { count: 100, reward: "₹3500 Cash या आपकी पसंद का सामान" },
];

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }
  const admin = createAdminClient();

  const { data: commissions } = await admin.from("book_commissions").select("amount_paise, status, claimed").eq("user_id", user.id);
  const pendingPaise = (commissions ?? []).filter((c) => c.status === "pending").reduce((s, c) => s + c.amount_paise, 0);
  const claimablePaise = (commissions ?? []).filter((c) => c.status === "tracked" && !c.claimed).reduce((s, c) => s + c.amount_paise, 0);
  const claimedPaise = (commissions ?? []).filter((c) => c.claimed).reduce((s, c) => s + c.amount_paise, 0);

  const { count: totalBooksSold } = await admin
    .from("book_orders")
    .select("*", { count: "exact", head: true })
    .eq("referred_by", user.id);

  const booksSold = totalBooksSold ?? 0;

  for (const m of MILESTONES) {
    if (booksSold >= m.count) {
      const { data: existing } = await admin
        .from("creator_rewards")
        .select("id")
        .eq("user_id", user.id)
        .eq("milestone", m.count)
        .maybeSingle();
      if (!existing) {
        await admin.from("creator_rewards").insert({
          user_id: user.id,
          milestone: m.count,
          reward_description: m.reward,
          status: "pending",
        });
      }
    }
  }

  const { data: rewards } = await admin.from("creator_rewards").select("*").eq("user_id", user.id).order("milestone", { ascending: true });

  return NextResponse.json({
    pending_paise: pendingPaise,
    claimable_paise: claimablePaise,
    claimed_paise: claimedPaise,
    total_books_sold: booksSold,
    milestones: MILESTONES.map((m) => ({
      ...m,
      achieved: booksSold >= m.count,
      status: rewards?.find((r) => r.milestone === m.count)?.status ?? "not_achieved",
    })),
  });
}
