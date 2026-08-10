import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { askGemini } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const { prompt: question, answer } = body;

  if (!answer || answer.trim().length < 10) {
    return NextResponse.json({ error: { code: "validation_error", message: "कम से कम कुछ lines लिखें feedback के लिए" } }, { status: 400 });
  }

  const aiPrompt = `Tum ek communication skills coach ho. Ek student ne ye interview-style sawaal ka jawab likha hai:

Sawaal: "${question}"
Student ka jawab: "${answer}"

Simple Hinglish mein (Roman script) constructive feedback do:
1. Kya achha tha (1-2 points)
2. Kya better ho sakta hai (2-3 specific suggestions - clarity, structure, confidence, filler words wagera)
3. Ek improved version ka example (2-3 lines)

Friendly aur encouraging tone rakho, harsh mat bano.`;

  try {
    const feedback = await askGemini(aiPrompt);
    return NextResponse.json({ feedback });
  } catch (err) {
    return NextResponse.json({ error: { code: "ai_failed", message: err instanceof Error ? err.message : "AI error" } }, { status: 500 });
  }
}
