import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { awardPoints } from "@/lib/points/awardPoints";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const answers: { question_id: string; selected_option_id: string }[] = body.answers ?? [];

  const admin = createAdminClient();
  const { data: quiz } = await admin.from("quizzes").select("id").eq("slug", slug).single();
  if (!quiz) {
    return NextResponse.json({ error: { code: "not_found", message: "Quiz नहीं मिली" } }, { status: 404 });
  }

  const { data: existingAttempt } = await admin.from("quiz_attempts").select("id").eq("quiz_id", quiz.id).eq("profile_id", user.id).maybeSingle();
  if (existingAttempt) {
    return NextResponse.json({ error: { code: "already_attempted", message: "आप यह quiz पहले खेल चुके हैं" } }, { status: 400 });
  }

  const { data: questions } = await admin.from("quiz_questions").select("id, correct_option_id, points_value").eq("quiz_id", quiz.id);

  let correctCount = 0;
  let score = 0;
  for (const answer of answers) {
    const question = questions?.find((q) => q.id === answer.question_id);
    if (question && question.correct_option_id === answer.selected_option_id) {
      correctCount++;
      score += question.points_value ?? 2;
    }
  }

  await admin.from("quiz_attempts").insert({
    quiz_id: quiz.id,
    profile_id: user.id,
    score,
    correct_count: correctCount,
    total_questions: questions?.length ?? 0,
    submitted_at: new Date().toISOString(),
    answers,
  });

  await awardPoints(user.id, "quiz_participation", 10, "Quiz attempted: " + slug);
  if (correctCount > 0) {
    await awardPoints(user.id, "quiz_correct_answer", correctCount * 2, correctCount + " correct answers");
  }

  return NextResponse.json({ score, correct_count: correctCount, total_questions: questions?.length ?? 0 });
}
