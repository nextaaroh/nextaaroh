import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: { code: "invalid", message: "Invalid promo code" } }, { status: 404 });
  }

  if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
    return NextResponse.json({ error: { code: "expired", message: "Promo code expire हो गया है" } }, { status: 400 });
  }

  return NextResponse.json({ data });
}
