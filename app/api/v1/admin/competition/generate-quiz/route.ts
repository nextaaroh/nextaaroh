import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { chatWithGroq } from "@/lib/ai/gemini";

function extractJson(text: string) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("AI ने सही format में जवाब नहीं दिया");
  return JSON.parse(match[0]);
}

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const body = await req.json();
  const { competition_id } = body;

  const prompt = `Ek quiz competition ke liye 25 challenging multiple-choice questions banao — general knowledge, current affairs, aptitude, aur reasoning ka achha mix. Har question ke 4 options hon, sirf ek sahi.

JAWAB SIRF is JSON array format mein do, kuch aur text mat likho:
[
  { "question": "...", "options": ["...", "...", "...", "..."], "correct_index": 0 }
]`;

  const admin = createAdminClient();

  try {
    const aiResponse = await chatWithGroq([{ role: "user", content: prompt }]);
    const parsed = extractJson(aiResponse);

    if (!Array.isArray(parsed) || parsed.length < 20) {
      return NextResponse.json({ error: { code: "ai_incomplete", message: "AI ने पूरे 25 questions नहीं दिए, फिर try करें" } }, { status: 400 });
    }

    const { data: quiz, error: quizError } = await admin
      .from("quizzes")
      .insert({ title: "Quiz Competition", slug: "competition-" + Date.now(), type: "competition", is_timed: true, time_limit_seconds: 1800, competition_id })
      .select("id")
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: { code: "insert_failed", message: quizError?.message } }, { status: 400 });
    }

    const questionRows = parsed.slice(0, 25).map((q: { question: string; options: string[]; correct_index: number }, index: number) => ({
      quiz_id: quiz.id,
      question_text: q.question,
      options: q.options.map((text: string, i: number) => ({ id: "opt" + i, text })),
      correct_option_id: "opt" + q.correct_index,
      order_index: index,
    }));

    await admin.from("quiz_questions").insert(questionRows);
    await admin.from("quiz_competitions").update({ quiz_id: quiz.id, status: "live" }).eq("id", competition_id);

    return NextResponse.json({ success: true, message: "25 AI questions के साथ competition quiz बन गया (30 मिनट timer)!" });
  } catch (err) {
    return NextResponse.json({ error: { code: "ai_failed", message: err instanceof Error ? err.message : "AI error" } }, { status: 500 });
  }
}
