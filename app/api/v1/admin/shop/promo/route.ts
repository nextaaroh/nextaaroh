import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin.from("promo_codes").select("*").order("created_at", { ascending: false });
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
  const { code, discount_type, discount_value, source, expiry_date } = body;

  if (!code || !discount_type || !discount_value) {
    return NextResponse.json({ error: { code: "validation_error", message: "Code, type, value ज़रूरी हैं" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("promo_codes").insert({
    code,
    discount_type,
    discount_value,
    source: source ?? null,
    expiry_date: expiry_date ?? null,
    is_active: true,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
