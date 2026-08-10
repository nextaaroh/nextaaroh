import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const quizId = searchParams.get("quiz_id");

  const admin = createAdminClient();

  if (!quizId) {
    const { data: quizzes } = await admin.from("quizzes").select("id, title, slug, type, created_at").order("created_at", { ascending: false }).limit(50);
    return NextResponse.json({ quizzes: quizzes ?? [] });
  }

  const { data: attempts } = await admin
    .from("quiz_attempts")
    .select("id, profile_id, score, correct_count, total_questions, answers, submitted_at, profiles!quiz_attempts_profile_id_fkey(username, full_name)")
    .eq("quiz_id", quizId)
    .order("correct_count", { ascending: false });

  return NextResponse.json({ attempts: attempts ?? [] });
}
