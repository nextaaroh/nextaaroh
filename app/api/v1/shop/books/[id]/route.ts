import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from("books").select("*").eq("id", id).eq("is_active", true).single();
  if (error || !data) {
    return NextResponse.json({ error: { code: "not_found", message: "Book नहीं मिली" } }, { status: 404 });
  }
  return NextResponse.json({ data });
}
