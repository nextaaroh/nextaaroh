import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: "unauthorized", message: "पहले login करें" } }, { status: 401 });
  }

  const { error } = await supabase.from("profile_certificates").delete().eq("id", id).eq("profile_id", user.id);
  if (error) {
    return NextResponse.json({ error: { code: "delete_failed", message: error.message } }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
