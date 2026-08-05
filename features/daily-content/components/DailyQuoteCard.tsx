"use client";
import { useEffect, useState } from "react";

type Quote = { quote_text: string; author: string | null };

export default function DailyQuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetch("/api/v1/daily-quote")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setQuote(data))
      .catch(() => setQuote(null));
  }, []);

  return (
    <div className="mx-4 my-4 rounded-xl bg-gradient-to-br from-[#0a1a3a] to-[#132a5c] text-white p-5">
      <p className="text-xs uppercase tracking-wide text-orange-400 mb-2">Today's Quote</p>
      {quote ? (
        <>
          <p className="text-lg font-medium leading-snug">&ldquo;{quote.quote_text}&rdquo;</p>
          {quote.author && <p className="text-sm text-white/60 mt-2">— {quote.author}</p>}
        </>
      ) : (
        <p className="text-white/50 text-sm">Loading...</p>
      )}
    </div>
  );
}