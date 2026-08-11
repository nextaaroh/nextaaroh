import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Manager access ज़रूरी है" } }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: conversation } = await admin
    .from("manager_conversations")
    .select("id, student_id, profiles!manager_conversations_student_id_fkey(full_name, username, mobile_number)")
    .eq("id", id)
    .single();

  const { data: messages } = await admin.from("manager_messages").select("id, sender_id, message, created_at").eq("conversation_id", id).order("created_at", { ascending: true });

  await admin.from("manager_messages").update({ is_read: true }).eq("conversation_id", id).eq("sender_id", conversation?.student_id ?? "");

  return NextResponse.json({ conversation, messages: messages ?? [] });
}
