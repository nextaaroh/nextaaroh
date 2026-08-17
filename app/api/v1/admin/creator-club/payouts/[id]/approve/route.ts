import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const { id } = await params;
  const admin = createAdminClient();

  const { data: payout } = await admin
    .from("creator_payouts")
    .select("*, creator_links(user_id)")
    .eq("id", id)
    .single();

  if (!payout) {
    return NextResponse.json({ error: { code: "not_found", message: "Payout नहीं मिला" } }, { status: 404 });
  }

  const userId = payout.creator_links?.user_id;
  if (!userId) {
    return NextResponse.json({ error: { code: "invalid", message: "User नहीं मिला" } }, { status: 400 });
  }

  const { data: profile } = await admin.from("profiles").select("wallet_balance_paise").eq("id", userId).single();
  const newBalance = (profile?.wallet_balance_paise ?? 0) + payout.amount_paise;

  await admin.from("profiles").update({ wallet_balance_paise: newBalance }).eq("id", userId);
  await admin.from("creator_payouts").update({ status: "tracked", approved_at: new Date().toISOString() }).eq("id", id);

  return NextResponse.json({ success: true });
}
