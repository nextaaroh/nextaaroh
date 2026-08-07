import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const [quizAttempts, certificates, watchSessions, applyClicks, profile] = await Promise.all([
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("certificates").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("video_watch_sessions").select("seconds_watched").eq("profile_id", user.id),
    supabase.from("apply_clicks").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
    supabase.from("profiles").select("skills, points_balance").eq("id", user.id).single(),
  ]);

  const totalSeconds = (watchSessions.data ?? []).reduce((sum, row) => sum + (row.seconds_watched ?? 0), 0);
  const hoursLearned = Math.round((totalSeconds / 3600) * 10) / 10;

  return NextResponse.json({
    hours_learned: hoursLearned,
    quizzes_completed: quizAttempts.count ?? 0,
    certificates_earned: certificates.count ?? 0,
    jobs_applied: applyClicks.count ?? 0,
    skills_count: profile.data?.skills?.length ?? 0,
    points_balance: profile.data?.points_balance ?? 0,
  });
}
