import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data } = await admin.from("question_bank").select("id, question_text, subject, difficulty, used_count").order("created_at", { ascending: false }).limit(100);
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const body = await req.json();
  const { question_text, options, correct_index, subject, difficulty } = body;

  if (!question_text || !options || options.length < 2) {
    return NextResponse.json({ error: { code: "validation_error", message: "Question और कम से कम 2 options ज़रूरी हैं" } }, { status: 400 });
  }

  const optionObjects = options.map((text: string, i: number) => ({ id: "opt" + i, text }));
  const admin = createAdminClient();
  const { error } = await admin.from("question_bank").insert({
    question_text,
    options: optionObjects,
    correct_option_id: "opt" + correct_index,
    subject: subject || null,
    difficulty: difficulty || "medium",
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
