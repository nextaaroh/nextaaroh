import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  await admin.from("site_visits").insert({
    profile_id: user?.id ?? null,
    path: body.path ?? null,
  });

  return NextResponse.json({ success: true });
}
