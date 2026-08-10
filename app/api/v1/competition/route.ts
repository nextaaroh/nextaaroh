import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createAdminClient();
  const { data: competition } = await admin
    .from("quiz_competitions")
    .select("id, title, entry_fee_paise, discounted_fee_paise, registration_start, registration_end, competition_date, status, quiz_id")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!competition) {
    return NextResponse.json({ competition: null, registered: false });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let registered = false;
  if (user) {
    const { data: reg } = await admin.from("competition_registrations").select("id, payment_status").eq("competition_id", competition.id).eq("profile_id", user.id).maybeSingle();
    registered = !!reg;
  }

  return NextResponse.json({ competition, registered });
}
