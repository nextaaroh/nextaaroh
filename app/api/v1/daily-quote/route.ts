import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const FALLBACK_QUOTES = [
  { quote_text: "सफलता उन्हीं को मिलती है जो रोज़ थोड़ा-थोड़ा आगे बढ़ते हैं।", author: "NextAaroh" },
  { quote_text: "आज का एक छोटा प्रयास, कल की बड़ी उपलब्धि है।", author: "NextAaroh" },
  { quote_text: "सीखना कभी बंद मत करो, ज़िंदगी सिखाना कभी बंद नहीं करती।", author: "NextAaroh" },
];

export async function GET() {
  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await admin.from("daily_quotes").select("quote_text, author").eq("publish_date", today).maybeSingle();

  if (data) {
    return NextResponse.json(data);
  }

  const dayIndex = new Date().getDate() % FALLBACK_QUOTES.length;
  return NextResponse.json(FALLBACK_QUOTES[dayIndex]);
}
