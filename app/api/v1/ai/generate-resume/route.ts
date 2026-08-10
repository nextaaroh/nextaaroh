import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { askGemini } from "@/lib/ai/gemini";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, dream, skills, bio, instagram_url, linkedin_url").eq("id", user.id).single();
  const { data: certificates } = await supabase.from("profile_certificates").select("title, issuer").eq("profile_id", user.id);
  const { data: projects } = await supabase.from("profile_projects").select("title, description").eq("profile_id", user.id);

  const prompt = `Tum ek professional resume writer ho. Is student ki details se ek clean, professional resume text banao (plain text format, ATS-friendly, sections mein: SUMMARY, SKILLS, PROJECTS, CERTIFICATIONS):

Naam: ${profile?.full_name}
Career goal: ${profile?.dream ?? "not specified"}
Current bio: ${profile?.bio ?? "not specified"}
Skills: ${profile?.skills?.join(", ") ?? "none"}
Projects: ${JSON.stringify(projects ?? [])}
Certificates: ${JSON.stringify(certificates ?? [])}
LinkedIn: ${profile?.linkedin_url ?? "none"}

Ek achha professional SUMMARY paragraph khud likho (2-3 lines) jo unki skills/goal ko highlight kare. Projects aur certificates ko bullet points mein professionally rewrite karo. Sirf plain text do, koi markdown ya extra commentary nahi.`;

  try {
    const resumeText = await askGemini(prompt);
    return NextResponse.json({ resume_text: resumeText });
  } catch (err) {
    return NextResponse.json({ error: { code: "ai_failed", message: err instanceof Error ? err.message : "AI error" } }, { status: 500 });
  }
}
