import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";

  const admin = createAdminClient();
  let query = admin
    .from("profiles")
    .select("id, username, full_name, mobile_number, role, status, class_segment, state, district, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (search) {
    query = query.or("username.ilike.%" + search + "%,full_name.ilike.%" + search + "%");
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ data });
}
