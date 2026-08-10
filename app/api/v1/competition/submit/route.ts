import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const { quiz_id, answers, violation_count } = body;

  const admin = createAdminClient();
  const { data: attempt } = await admin
    .from("quiz_attempts")
    .select("id, deadline_at, submitted_at")
    .eq("quiz_id", quiz_id)
    .eq("profile_id", user.id)
    .single();

  if (!attempt) {
    return NextResponse.json({ error: { code: "not_started", message: "पहले quiz शुरू करें" } }, { status: 400 });
  }
  if (attempt.submitted_at) {
    return NextResponse.json({ error: { code: "already_submitted", message: "पहले ही submit हो चुका है" } }, { status: 400 });
  }

  const now = Date.now();
  const deadline = new Date(attempt.deadline_at).getTime();
  const gracePeriodMs = 5000;
  if (now > deadline + gracePeriodMs) {
    await admin.from("quiz_attempts").update({ submitted_at: new Date().toISOString(), answers: [], violation_count: violation_count ?? 0 }).eq("id", attempt.id);
    return NextResponse.json({ error: { code: "time_up", message: "समय समाप्त हो गया, कोई जवाब count नहीं होगा" } }, { status: 400 });
  }

  const { data: questions } = await admin.from("quiz_questions").select("id, correct_option_id").eq("quiz_id", quiz_id);

  let correctCount = 0;
  const answerList: { question_id: string; selected_option_id: string }[] = answers ?? [];
  for (const answer of answerList) {
    const question = questions?.find((q) => q.id === answer.question_id);
    if (question && question.correct_option_id === answer.selected_option_id) {
      correctCount++;
    }
  }

  await admin.from("quiz_attempts").update({
    submitted_at: new Date().toISOString(),
    correct_count: correctCount,
    total_questions: questions?.length ?? 25,
    answers: answerList,
    violation_count: violation_count ?? 0,
  }).eq("id", attempt.id);

  return NextResponse.json({ correct_count: correctCount, total_questions: questions?.length ?? 25 });
}
