import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("learning_videos").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ data: data ?? [] });
}
