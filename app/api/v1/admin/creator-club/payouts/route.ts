import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("creator_payouts")
    .select("*, creator_links(video_label, ref_code, user_id, profiles(full_name, username, mobile_number))")
    .order("requested_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: { code: "fetch_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ data });
}
