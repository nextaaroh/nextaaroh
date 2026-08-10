import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from("workplace_listings").select("id, title, organization, description, location, apply_link").eq("id", slug).single();

  if (error || !data) {
    return NextResponse.json({ error: { code: "not_found", message: "Listing नहीं मिली" } }, { status: 404 });
  }
  return NextResponse.json(data);
}
