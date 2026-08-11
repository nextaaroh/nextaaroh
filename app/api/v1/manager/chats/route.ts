import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Manager access ज़रूरी है" } }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: conversations } = await admin
    .from("manager_conversations")
    .select("id, student_id, updated_at, profiles!manager_conversations_student_id_fkey(full_name, username, mobile_number)")
    .order("updated_at", { ascending: false });

  const result = [];
  for (const conv of conversations ?? []) {
    const { data: lastMsg } = await admin.from("manager_messages").select("message, created_at").eq("conversation_id", conv.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    const { count: unreadCount } = await admin.from("manager_messages").select("id", { count: "exact", head: true }).eq("conversation_id", conv.id).eq("is_read", false).eq("sender_id", conv.student_id);
    result.push({ ...conv, last_message: lastMsg?.message ?? null, last_message_at: lastMsg?.created_at ?? null, unread_count: unreadCount ?? 0 });
  }

  return NextResponse.json({ data: result });
}
