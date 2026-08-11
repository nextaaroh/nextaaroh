import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Manager access ज़रूरी है" } }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const body = await req.json();

  if (!body.message?.trim()) {
    return NextResponse.json({ error: { code: "validation_error", message: "Message खाली नहीं हो सकता" } }, { status: 400 });
  }

  const admin = createAdminClient();
  await admin.from("manager_messages").insert({ conversation_id: id, sender_id: user!.id, message: body.message });
  await admin.from("manager_conversations").update({ updated_at: new Date().toISOString(), manager_id: user!.id }).eq("id", id);

  return NextResponse.json({ success: true });
}
