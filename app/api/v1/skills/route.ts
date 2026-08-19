import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const admin = createAdminClient();
  let query = admin.from("skills").select("*").eq("is_active", true).order("name");
  if (category) {
    query = query.eq("category", category);
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ data });
}
