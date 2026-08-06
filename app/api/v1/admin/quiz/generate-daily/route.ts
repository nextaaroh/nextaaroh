import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

const QUESTIONS_PER_QUIZ = 10;
const QUIZZES_PER_DAY = 3;
const TIME_LIMIT_SECONDS = 600;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function POST() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: existing } = await admin.from("quizzes").select("id").like("slug", "daily-" + today + "-%");
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: { code: "already_generated", message: "आज के quiz पहले ही बन चुके हैं" } }, { status: 400 });
  }

  const needed = QUESTIONS_PER_QUIZ * QUIZZES_PER_DAY;
  const { data: bankQuestions, error } = await admin
    .from("question_bank")
    .select("id, question_text, options, correct_option_id")
    .order("used_count", { ascending: true })
    .limit(needed * 2);

  if (error || !bankQuestions || bankQuestions.length < needed) {
    return NextResponse.json(
      { error: { code: "not_enough_questions", message: "Bank में कम से कम " + needed + " questions चाहिए, अभी " + (bankQuestions?.length ?? 0) + " हैं" } },
      { status: 400 }
    );
  }

  const picked = shuffle(bankQuestions).slice(0, needed);
  const messages: string[] = [];

  for (let quizIndex = 0; quizIndex < QUIZZES_PER_DAY; quizIndex++) {
    const questionsForThisQuiz = picked.slice(quizIndex * QUESTIONS_PER_QUIZ, (quizIndex + 1) * QUESTIONS_PER_QUIZ);
    const slug = "daily-" + today + "-" + (quizIndex + 1);
    const title = "Daily Quiz " + (quizIndex + 1) + " — " + today;

    const { data: quiz, error: quizError } = await admin
      .from("quizzes")
      .insert({ title, slug, type: "self_paced", is_timed: true, time_limit_seconds: TIME_LIMIT_SECONDS })
      .select("id")
      .single();

    if (quizError || !quiz) continue;

    const questionRows = questionsForThisQuiz.map((q, i) => ({
      quiz_id: quiz.id,
      question_text: q.question_text,
      options: q.options,
      correct_option_id: q.correct_option_id,
      order_index: i,
    }));

    await admin.from("quiz_questions").insert(questionRows);

    for (const q of questionsForThisQuiz) {
      await admin.from("question_bank").update({ used_count: (q as { used_count?: number }).used_count ?? 0 }).eq("id", q.id);
    }

    messages.push(title);
  }

  return NextResponse.json({ success: true, message: messages.length + " quizzes बन गए: " + messages.join(", ") });
}
