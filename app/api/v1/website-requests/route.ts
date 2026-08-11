import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { full_name, business_name, whatsapp_number, business_category, package: pkg } = body;

  if (!full_name || !business_name || !whatsapp_number || !business_category || !pkg) {
    return NextResponse.json({ error: { code: "validation_error", message: "सारी ज़रूरी fields भरें" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("website_service_requests").insert({
    full_name,
    business_name,
    whatsapp_number,
    email: body.email ?? null,
    business_category,
    package: pkg,
    required_pages: body.required_pages ?? null,
    business_description: body.business_description ?? null,
    services_products: body.services_products ?? null,
    business_address: body.business_address ?? null,
    google_maps_location: body.google_maps_location ?? null,
    social_link: body.social_link ?? null,
    website_whatsapp_number: body.website_whatsapp_number ?? null,
    has_logo: body.has_logo ?? null,
    has_photos: body.has_photos ?? null,
    additional_requirements: body.additional_requirements ?? null,
    preferred_contact_method: body.preferred_contact_method ?? null,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
