import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { askGemini } from "@/lib/ai/gemini";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, dream, skills, bio, class_segment").eq("id", user.id).single();

  const prompt = `Tum ek career coach ho jo Indian students/job-seekers ko guide karte ho. Simple Hinglish mein jawab do (Roman script mein Hindi+English mix), friendly aur practical tone mein.

Student ki details:
- Naam: ${profile?.full_name ?? "Unknown"}
- Dream/Goal: ${profile?.dream ?? "not mentioned"}
- Skills: ${profile?.skills?.join(", ") ?? "none listed"}
- Bio: ${profile?.bio ?? "not mentioned"}
- Segment: ${profile?.class_segment ?? "unknown"}

Is student ko 5 specific, actionable career tips do jo unki current situation ke hisaab se ho. Har tip 1-2 lines mein ho, numbered list mein. Generic advice mat do, unki actual skills/dream ke hisaab se personalize karo.`;

  try {
    const advice = await askGemini(prompt);
    return NextResponse.json({ advice });
  } catch (err) {
    return NextResponse.json({ error: { code: "ai_failed", message: err instanceof Error ? err.message : "AI error" } }, { status: 500 });
  }
}
