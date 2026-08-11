import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const admin = createAdminClient();
  let { data: conversation } = await admin.from("manager_conversations").select("id").eq("student_id", user.id).maybeSingle();

  if (!conversation) {
    const { data: created } = await admin.from("manager_conversations").insert({ student_id: user.id }).select("id").single();
    conversation = created;
  }

  const { data: messages } = await admin
    .from("manager_messages")
    .select("id, sender_id, message, created_at")
    .eq("conversation_id", conversation!.id)
    .order("created_at", { ascending: true });

  await admin.from("manager_messages").update({ is_read: true }).eq("conversation_id", conversation!.id).neq("sender_id", user.id);

  return NextResponse.json({ conversation_id: conversation!.id, messages: messages ?? [], my_id: user.id });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  if (!body.message?.trim()) {
    return NextResponse.json({ error: { code: "validation_error", message: "Message खाली नहीं हो सकता" } }, { status: 400 });
  }

  const admin = createAdminClient();
  let { data: conversation } = await admin.from("manager_conversations").select("id").eq("student_id", user.id).maybeSingle();
  if (!conversation) {
    const { data: created } = await admin.from("manager_conversations").insert({ student_id: user.id }).select("id").single();
    conversation = created;
  }

  await admin.from("manager_messages").insert({ conversation_id: conversation!.id, sender_id: user.id, message: body.message });
  await admin.from("manager_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversation!.id);

  return NextResponse.json({ success: true });
}
