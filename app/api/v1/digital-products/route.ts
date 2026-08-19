import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const pricingType = req.nextUrl.searchParams.get("pricing_type");
  const admin = createAdminClient();
  let query = admin.from("digital_products").select("*").eq("is_active", true).order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  if (pricingType) query = query.eq("pricing_type", pricingType);
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ data });
}
