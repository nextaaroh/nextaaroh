import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: { code: "forbidden", message: "Admin access ज़रूरी है" } }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: competition } = await admin.from("quiz_competitions").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();

  if (!competition) {
    return NextResponse.json({ competition: null, registrations: [], results: [] });
  }

  const { data: registrations } = await admin
    .from("competition_registrations")
    .select("id, payment_status, registered_at, profiles!competition_registrations_profile_id_fkey(username, full_name)")
    .eq("competition_id", competition.id)
    .order("registered_at", { ascending: false });

  let results: unknown[] = [];
  if (competition.quiz_id) {
    const { data: attempts } = await admin
      .from("quiz_attempts")
      .select("correct_count, total_questions, submitted_at, profiles!quiz_attempts_profile_id_fkey(username, full_name)")
      .eq("quiz_id", competition.quiz_id)
      .order("correct_count", { ascending: false })
      .order("submitted_at", { ascending: true });
    results = attempts ?? [];
  }

  return NextResponse.json({ competition, registrations: registrations ?? [], results });
}
