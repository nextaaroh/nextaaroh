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
  const { data: product } = await admin.from("marketplace_products").select("status, seller_id").eq("id", id).single();

  const { error } = await admin.from("marketplace_products").update({ status: "published" }).eq("id", id);
  if (error) {
    return NextResponse.json({ error: { code: "update_failed", message: error.message } }, { status: 400 });
  }

  if (product?.seller_id) {
    await admin.from("points_ledger").insert({
      profile_id: product.seller_id,
      action: "notes_upload_approved",
      points: 30,
      reference_type: "marketplace_product",
      reference_id: id,
    });
    await admin.rpc("increment_points_balance", { p_profile_id: product.seller_id, p_points: 30 });
  }

  return NextResponse.json({ success: true });
}
