import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const { decision } = body;

  if (decision !== "approved" && decision !== "rejected") {
    return NextResponse.json({ error: { code: "validation_error", message: "Invalid decision" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: application, error: fetchError } = await admin
    .from("creator_applications")
    .select("user_id")
    .eq("id", id)
    .single();

  if (fetchError || !application) {
    return NextResponse.json({ error: { code: "not_found", message: "Application नहीं मिली" } }, { status: 404 });
  }

  await admin
    .from("creator_applications")
    .update({ status: decision, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (decision === "approved") {
    await admin.from("profiles").update({ is_approved_creator: true }).eq("id", application.user_id);
  }

  return NextResponse.json({ success: true });
}
