import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { signupSchema, MINOR_SEGMENTS } from "@/features/auth/validators/signupSchema";
import { awardPoints } from "@/lib/points/awardPoints";

function generateReferralCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "NSI";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation_error", message: "Invalid input", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const admin = createAdminClient();

  const { data: existingUsername } = await admin.from("profiles").select("id").eq("username", data.username).maybeSingle();
  if (existingUsername) {
    return NextResponse.json({ error: { code: "username_taken", message: "यह username पहले से इस्तेमाल हो रहा है" } }, { status: 400 });
  }

  const { data: existingMobile } = await admin.from("profiles").select("id").eq("mobile_number", data.mobile_number).maybeSingle();
  if (existingMobile) {
    return NextResponse.json({ error: { code: "mobile_taken", message: "यह mobile number पहले से registered है" } }, { status: 400 });
  }

  let referralCode = generateReferralCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await admin.from("profiles").select("id").eq("referral_code", referralCode).maybeSingle();
    if (!existing) break;
    referralCode = generateReferralCode();
  }

  const authEmail = data.username.toLowerCase() + "@nextaaroh.local";
  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: authEmail,
    password: data.password,
    email_confirm: true,
  });

  if (authError || !authUser?.user) {
    return NextResponse.json({ error: { code: "signup_failed", message: authError?.message ?? "Account नहीं बन पाया" } }, { status: 400 });
  }

  const isMinor = MINOR_SEGMENTS.includes(data.class_segment);
  let referrerId: string | null = null;
  if (data.referral_code) {
    const { data: referrer } = await admin.from("profiles").select("id").eq("referral_code", data.referral_code).maybeSingle();
    if (referrer) referrerId = referrer.id;
  }

  const { data: educatorMatch } = await admin.from("educator_directory").select("educator_title, full_name, claimed").eq("mobile_number", data.mobile_number).maybeSingle();

  const { error: profileError } = await admin.from("profiles").insert({
    id: authUser.user.id,
    username: data.username,
    full_name: data.full_name,
    mobile_number: data.mobile_number,
    mobile_verified_at: new Date().toISOString(),
    pin_code: data.pin_code,
    state: data.state,
    district: data.district,
    class_segment: data.class_segment,
    segment_other_text: data.segment_other_text ?? null,
    language_code: data.language_code,
    dream: data.dream ?? null,
    referral_code: referralCode,
    referred_by: referrerId,
    is_minor: isMinor,
    guardian_mobile_number: data.guardian_mobile_number ?? null,
    guardian_consent_given_at: isMinor ? new Date().toISOString() : null,
    status: "active",
    role: educatorMatch ? "educator" : "student",
    educator_title: educatorMatch?.educator_title ?? null,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    return NextResponse.json({ error: { code: "profile_failed", message: profileError.message } }, { status: 400 });
  }

  if (educatorMatch && !educatorMatch.claimed) {
    await admin.from("educator_directory").update({ claimed: true, claimed_by: authUser.user.id }).eq("mobile_number", data.mobile_number);
  }

  await awardPoints(authUser.user.id, "signup", 50, "Signup bonus");

  const creatorRef = body.creator_ref;
  if (creatorRef) {
    const { data: creatorLink } = await admin.from("creator_links").select("id").eq("ref_code", creatorRef).maybeSingle();
    if (creatorLink) {
      await admin.from("creator_signups").insert({ creator_link_id: creatorLink.id, new_user_id: authUser.user.id });
    }
  }

  if (referrerId) {
    await admin.from("referrals").insert({
      referrer_id: referrerId,
      referee_id: authUser.user.id,
      referral_code_used: data.referral_code,
    });
  }

  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email: authEmail, password: data.password });

  return NextResponse.json({
    success: true,
    educator_welcome: educatorMatch ? "You're " + educatorMatch.educator_title + "! 🎉" : null,
  });
}
