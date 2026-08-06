import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(text: string) {
  return text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") + "-" + Date.now().toString(36);
}

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data } = await admin.from("quizzes").select("id, title, slug, subject, class_segment, created_at").order("created_at", { ascending: false });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { authorized, profile } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const body = await req.json();
  const { title, subject, class_segment, questions } = body;

  if (!title || !questions || questions.length === 0) {
    return NextResponse.json({ error: { code: "validation_error", message: "Title और कम से कम एक question ज़रूरी है" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: quiz, error: quizError } = await admin
    .from("quizzes")
    .insert({ title, slug: slugify(title), subject: subject || null, class_segment: class_segment || null, type: "self_paced" })
    .select("id")
    .single();

  if (quizError || !quiz) {
    return NextResponse.json({ error: { code: "insert_failed", message: quizError?.message ?? "Quiz नहीं बन पाया" } }, { status: 400 });
  }

  const questionRows = questions.map((q: { question_text: string; options: string[]; correct_index: number }, index: number) => {
    const optionObjects = q.options.map((text: string, i: number) => ({ id: "opt" + i, text }));
    return {
      quiz_id: quiz.id,
      question_text: q.question_text,
      options: optionObjects,
      correct_option_id: "opt" + q.correct_index,
      order_index: index,
    };
  });

  const { error: questionsError } = await admin.from("quiz_questions").insert(questionRows);
  if (questionsError) {
    return NextResponse.json({ error: { code: "insert_failed", message: questionsError.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true, quiz_id: quiz.id });
}
