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

  const { data: order, error: fetchError } = await admin
    .from("book_orders")
    .select("*, books(commission_percent)")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: { code: "not_found", message: "Order नहीं मिला" } }, { status: 404 });
  }

  const now = new Date();
  const unlockAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const { error: updateError } = await admin
    .from("book_orders")
    .update({ status: "ordered_on_meesho", meesho_ordered_at: now.toISOString() })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: { code: "update_failed", message: updateError.message } }, { status: 400 });
  }

  if (order.referred_by) {
    const commissionPercent = order.books?.commission_percent ?? 0;
    const amountPaise = Math.round((order.final_price_paise * commissionPercent) / 100);
    if (amountPaise > 0) {
      await admin.from("book_commissions").insert({
        order_id: id,
        user_id: order.referred_by,
        amount_paise: amountPaise,
        status: "pending",
        unlock_at: unlockAt.toISOString(),
      });
    }
  }

  return NextResponse.json({ success: true });
}
