import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const body = await req.json();
  const { competition_id, quiz_id } = body;

  const admin = createAdminClient();
  const { error } = await admin.from("quiz_competitions").update({ quiz_id, status: "live" }).eq("id", competition_id);

  if (error) {
    return NextResponse.json({ error: { code: "update_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
