import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const body = await req.json();
  const { competition_id } = body;

  const admin = createAdminClient();
  const { data: competition } = await admin.from("quiz_competitions").select("registration_start, registration_end, discounted_fee_paise").eq("id", competition_id).single();

  if (!competition) {
    return NextResponse.json({ error: { code: "not_found", message: "Competition नहीं मिला" } }, { status: 404 });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (today < competition.registration_start || today > competition.registration_end) {
    return NextResponse.json({ error: { code: "registration_closed", message: "अभी registration खुली नहीं है या बंद हो चुकी है" } }, { status: 400 });
  }

  const { error } = await admin.from("competition_registrations").insert({
    competition_id,
    profile_id: user.id,
    payment_status: "pending",
    amount_paid_paise: competition.discounted_fee_paise,
  });

  if (error) {
    return NextResponse.json({ error: { code: "insert_failed", message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Registration हो गई! Payment confirm होते ही आपको बता दिया जाएगा।" });
}
