import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username_or_mobile, password } = body;

  if (!username_or_mobile || !password) {
    return NextResponse.json(
      { error: { code: "validation_error", message: "Username/mobile और password दोनों ज़रूरी हैं" } },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("username")
    .or("username.eq." + username_or_mobile + ",mobile_number.eq." + username_or_mobile)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: { code: "invalid_credentials", message: "Username/mobile या password गलत है" } },
      { status: 400 }
    );
  }

  const authEmail = profile.username.toLowerCase() + "@nextaaroh.local";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password });

  if (error) {
    return NextResponse.json(
      { error: { code: "invalid_credentials", message: "Username/mobile या password गलत है" } },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
