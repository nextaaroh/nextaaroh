import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("marketplace_products")
    .select("id, title, description, cover_image_url, price_paise, category")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: { code: "not_found", message: "Product नहीं मिला" } }, { status: 404 });
  }

  return NextResponse.json(data);
}
