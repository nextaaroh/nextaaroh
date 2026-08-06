import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: quiz } = await supabase.from("quizzes").select("id, title, is_timed, time_limit_seconds").eq("slug", slug).single();
  if (!quiz) {
    return NextResponse.json({ error: { code: "not_found", message: "Quiz नहीं मिली" } }, { status: 404 });
  }

  const { data: questions } = await supabase.from("quiz_questions").select("id, question_text, options").eq("quiz_id", quiz.id).order("order_index");

  const safeQuestions = (questions ?? []).map((q) => ({
    id: q.id,
    question_text: q.question_text,
    options: shuffle(q.options as { id: string; text: string }[]),
  }));

  return NextResponse.json({
    title: quiz.title,
    is_timed: quiz.is_timed,
    time_limit_seconds: quiz.time_limit_seconds,
    questions: safeQuestions,
  });
}
