import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    book_id,
    referred_by,
    buyer_name,
    buyer_phone,
    house_no,
    road_area,
    pincode,
    city,
    state,
    promo_code,
    discount_paise,
    final_price_paise,
  } = body;

  if (!book_id || !buyer_name || !buyer_phone || !house_no || !road_area || !pincode || !city || !state) {
    return NextResponse.json(
      { error: { code: "validation_error", message: "सारी details भरना ज़रूरी है" } },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("book_orders").insert({
    book_id,
    referred_by: referred_by ?? null,
    buyer_name,
    buyer_phone,
    house_no,
    road_area,
    pincode,
    city,
    state,
    promo_code: promo_code ?? null,
    discount_paise: discount_paise ?? 0,
    final_price_paise,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
