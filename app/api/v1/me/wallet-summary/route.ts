import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }
  const admin = createAdminClient();

  const { data: profile } = await admin.from("profiles").select("wallet_balance_paise").eq("id", user.id).single();

  const { data: pendingCommissions } = await admin
    .from("book_commissions")
    .select("amount_paise")
    .eq("user_id", user.id)
    .eq("status", "pending");

  const pendingPaise = (pendingCommissions ?? []).reduce((s, c) => s + c.amount_paise, 0);

  return NextResponse.json({
    tracked_paise: profile?.wallet_balance_paise ?? 0,
    pending_paise: pendingPaise,
  });
}
