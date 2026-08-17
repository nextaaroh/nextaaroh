import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin.from("books").select("*").order("created_at", { ascending: false });
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
  const {
    title,
    cover_image_url,
    cover_image_url_2,
    price_paise,
    discount_percent,
    pages,
    publisher,
    meesho_link,
    commission_percent,
    author,
    description,
    language,
    category,
  } = body;

  if (!title || !meesho_link || !price_paise) {
    return NextResponse.json(
      { error: { code: "validation_error", message: "Title, Meesho link, Price ज़रूरी हैं" } },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("books").insert({
    title,
    cover_image_url: cover_image_url ?? null,
    cover_image_url_2: cover_image_url_2 ?? null,
    price_paise,
    discount_percent: discount_percent ?? 0,
    pages: pages ?? null,
    publisher: publisher ?? null,
    meesho_link,
    commission_percent: commission_percent ?? 0,
    author: author ?? null,
    description: description ?? null,
    language: language ?? "Hindi",
    category: category ?? "books",
    is_active: true,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
