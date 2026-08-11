import { NextRequest, NextResponse } from "next/server";
import { requireEducator } from "@/lib/auth/requireEducator";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authorized } = await requireEducator();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Educator access ज़रूरी है" } }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("meeting_rsvps")
    .select("profile_id, created_at, profiles!meeting_rsvps_profile_id_fkey(full_name, username, mobile_number)")
    .eq("meeting_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ data: data ?? [] });
}
