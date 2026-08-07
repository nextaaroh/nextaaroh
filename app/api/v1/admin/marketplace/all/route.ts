import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("marketplace_products")
    .select("id, title, category, price_paise, status, cover_image_url, is_admin_post, seller_id, created_at, profiles!marketplace_products_seller_id_fkey(username, full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ data: data ?? [] });
}
