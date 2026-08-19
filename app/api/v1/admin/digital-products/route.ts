import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin.from("digital_products").select("*").order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const body = await req.json();
  const { title, description, category, pricing_type, price_paise, cover_image_url, file_url, external_link } = body;

  if (!title || !category || !pricing_type) {
    return NextResponse.json({ error: { code: "validation_error", message: "Title, Category, Pricing Type ज़रूरी हैं" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("digital_products").insert({
    title,
    description: description ?? null,
    category,
    pricing_type,
    price_paise: pricing_type === "paid" ? (price_paise ?? 0) : 0,
    cover_image_url: cover_image_url ?? null,
    file_url: file_url ?? null,
    external_link: external_link ?? null,
    is_active: true,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
