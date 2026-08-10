import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chatWithGroq } from "@/lib/ai/gemini";
import { SITE_KNOWLEDGE } from "@/lib/ai/site-knowledge";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const { coach, messages } = body;

  if (!coach || !Array.isArray(messages)) {
    return NextResponse.json({ error: { code: "validation_error", message: "गलत request" } }, { status: 400 });
  }

  let systemPrompt = "";

  if (coach === "career") {
    const { data: profile } = await supabase.from("profiles").select("full_name, dream, skills, bio").eq("id", user.id).single();
    systemPrompt = `Tum NextAaroh platform ke AI Career Coach ho. Simple Hinglish (Roman script) mein baat karo, friendly aur practical tone mein. Chhote, clear jawab do (chat jaisa, lambe paragraphs nahi).

Student ki details:
Naam: ${profile?.full_name ?? "Unknown"}
Dream/Goal: ${profile?.dream ?? "not mentioned"}
Skills: ${profile?.skills?.join(", ") ?? "none listed"}
Bio: ${profile?.bio ?? "not mentioned"}

Career, jobs, skills, resume, interview jaise topics par practical advice do. Agar student kuch aur poochhe jo career se related na ho, to politely wapas career topic par le aao.`;
  } else if (coach === "communication") {
    systemPrompt = `Tum NextAaroh platform ke AI Communication Coach ho. Simple Hinglish (Roman script) mein baat karo, friendly aur encouraging tone mein. Chhote, clear jawab do (chat jaisa).

Student ki communication skills (public speaking, interview answers, confidence, clarity) improve karne mein madad karo. Agar student koi jawab/practice answer share kare, to constructive feedback do — kya achha tha, kya better ho sakta hai.`;
  } else if (coach === "help") {
    const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();
    const isAdmin = profile?.role === "admin";

    let liveInfo = "";
    if (isAdmin) {
      const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      liveInfo = `\n\nLive Platform Stats (sirf admin ke liye, normal users ko ye mat batana):\nTotal registered users: ${totalUsers ?? "N/A"}`;
    } else {
      liveInfo = `\n\nIs user ki apni jaankari:\nNaam: ${profile?.full_name ?? "Unknown"}`;
    }

    systemPrompt = `${SITE_KNOWLEDGE}${liveInfo}

Tum NextAaroh platform ke General Help Assistant ho. Simple Hinglish (Roman script) mein, chhote aur clear jawab do.

User ka role: ${isAdmin ? "Admin" : "Normal user"}.
${isAdmin ? "Admin ko live stats aur platform ki poori jaankari de sakte ho." : "Normal user ko sirf general site help do — usko admin-only stats mat batana."}

Website ke features, kaise use karein, ya koi bhi general sawaal ka jawab do. Agar pata na ho to seedha bol do "ye mujhe pata nahi, support team se poochho".`;
  } else {
    return NextResponse.json({ error: { code: "invalid_coach", message: "Invalid coach type" } }, { status: 400 });
  }

  const fullMessages = [{ role: "system" as const, content: systemPrompt }, ...messages];

  try {
    const reply = await chatWithGroq(fullMessages);
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: { code: "ai_failed", message: err instanceof Error ? err.message : "AI error" } }, { status: 500 });
  }
}
