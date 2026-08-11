import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const supabase = await createClient();

  let query = supabase.from("learning_videos").select("*").order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);

  const { data } = await query;
  return NextResponse.json({ data: data ?? [] });
}
