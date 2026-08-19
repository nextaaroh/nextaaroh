import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(text: string) {
  return text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin.from("skills").select("*").order("category").order("name");
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
  const { name, category, emoji, description } = body;

  if (!name || !category) {
    return NextResponse.json({ error: { code: "validation_error", message: "Name और Category ज़रूरी हैं" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("skills").insert({
    name,
    slug: slugify(name),
    category,
    emoji: emoji ?? null,
    description: description ?? null,
    is_active: true,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
