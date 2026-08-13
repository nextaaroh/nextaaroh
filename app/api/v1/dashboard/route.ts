import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("points_balance, current_streak_days").eq("id", user.id).single();

  return NextResponse.json({
    points_balance: profile?.points_balance ?? 0,
    current_streak_days: profile?.current_streak_days ?? 0,
  });
}
