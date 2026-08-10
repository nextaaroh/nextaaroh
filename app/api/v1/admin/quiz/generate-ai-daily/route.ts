import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { chatWithGroq } from "@/lib/ai/gemini";

function extractJson(text: string) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("AI ने सही format में जवाब नहीं दिया");
  return JSON.parse(match[0]);
}

export async function POST() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const admin = createAdminClient();
  const slug = "ai-daily-" + today;

  const { data: existing } = await admin.from("quizzes").select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: { code: "already_generated", message: "आज का AI quiz पहले ही बन चुका है" } }, { status: 400 });
  }

  const prompt = `General knowledge, current affairs, aur basic aptitude par 5 multiple-choice questions banao jo Indian students/job-seekers ke liye useful hon. Har question ke 4 options hon, sirf ek sahi.

JAWAB SIRF is JSON array format mein do, kuch aur text mat likho:
[
  { "question": "...", "options": ["...", "...", "...", "..."], "correct_index": 0 }
]`;

  try {
    const aiResponse = await chatWithGroq([{ role: "user", content: prompt }]);
    const parsed = extractJson(aiResponse);

    const { data: quiz, error: quizError } = await admin
      .from("quizzes")
      .insert({ title: "AI Daily Quiz — " + today, slug, type: "ai_daily", is_timed: true, time_limit_seconds: 300 })
      .select("id")
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: { code: "insert_failed", message: quizError?.message ?? "Quiz नहीं बन पाया" } }, { status: 400 });
    }

    const questionRows = parsed.map((q: { question: string; options: string[]; correct_index: number }, index: number) => ({
      quiz_id: quiz.id,
      question_text: q.question,
      options: q.options.map((text: string, i: number) => ({ id: "opt" + i, text })),
      correct_option_id: "opt" + q.correct_index,
      order_index: index,
    }));

    await admin.from("quiz_questions").insert(questionRows);

    return NextResponse.json({ success: true, message: "5 AI questions के साथ आज का quiz बन गया!" });
  } catch (err) {
    return NextResponse.json({ error: { code: "ai_failed", message: err instanceof Error ? err.message : "AI error" } }, { status: 500 });
  }
}
