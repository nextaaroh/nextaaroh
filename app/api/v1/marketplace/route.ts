import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const admin = createAdminClient();
  let query = admin
    .from("marketplace_products")
    .select("id, slug, title, cover_image_url, price_paise, category, is_admin_post")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ data: data ?? [] });
}
