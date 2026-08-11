import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MANAGER_MOBILE = "9343988416";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username_or_mobile, password } = body;

  if (!username_or_mobile || !password) {
    return NextResponse.json({ error: { code: "validation_error", message: "Username/mobile और password दोनों ज़रूरी हैं" } }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, username, mobile_number, role")
    .or("username.eq." + username_or_mobile + ",mobile_number.eq." + username_or_mobile)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: { code: "invalid_credentials", message: "Username/mobile या password गलत है" } }, { status: 400 });
  }

  const authEmail = profile.username.toLowerCase() + "@nextaaroh.local";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password });

  if (error) {
    return NextResponse.json({ error: { code: "invalid_credentials", message: "Username/mobile या password गलत है" } }, { status: 400 });
  }

  let welcomeMessage: string | null = null;

  if (profile.role === "student") {
    const { data: educatorMatch } = await admin.from("educator_directory").select("educator_title").eq("mobile_number", profile.mobile_number).maybeSingle();
    if (educatorMatch) {
      await admin.from("profiles").update({ role: "educator", educator_title: educatorMatch.educator_title }).eq("id", profile.id);
      await admin.from("educator_directory").update({ claimed: true, claimed_by: profile.id }).eq("mobile_number", profile.mobile_number);
      welcomeMessage = "You're " + educatorMatch.educator_title + "! 🎉";
    } else if (profile.mobile_number === MANAGER_MOBILE) {
      await admin.from("profiles").update({ role: "admin" }).eq("id", profile.id);
      welcomeMessage = "Welcome back, Manager! 👋";
    }
  }

  return NextResponse.json({ success: true, educator_welcome: welcomeMessage });
}
