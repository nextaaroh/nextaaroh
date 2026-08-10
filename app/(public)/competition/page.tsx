"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Competition = {
  id: string;
  title: string;
  entry_fee_paise: number;
  discounted_fee_paise: number;
  registration_start: string;
  registration_end: string;
  competition_date: string;
  status: string;
};

export default function CompetitionPage() {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");

  function load() {
    fetch("/api/v1/competition")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setCompetition(data?.competition ?? null);
        setRegistered(data?.registered ?? false);
      })
      .catch(() => {});
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRegister() {
    if (!competition) return;
    setRegistering(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/competition/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competition_id: competition.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error?.message ?? "कुछ गलत हो गया");
        return;
      }
      setMessage(data.message);
      load();
    } finally {
      setRegistering(false);
    }
  }

  if (!competition) {
    return <p className="text-center text-gray-400 text-sm py-8">अभी कोई competition उपलब्ध नहीं है</p>;
  }

  const originalRupees = (competition.entry_fee_paise / 100).toFixed(0);
  const discountedRupees = (competition.discounted_fee_paise / 100).toFixed(0);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-gradient-to-br from-purple-600 to-orange-500 text-white rounded-xl p-5 text-center mb-4">
        <p className="text-3xl mb-2">🏆</p>
        <h1 className="text-lg font-bold mb-1">{competition.title}</h1>
        <p className="text-xs opacity-90">Winners को Cash Prize मिलेगा!</p>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Entry Fee</span>
          <span>
            <span className="text-sm text-gray-400 line-through mr-2">₹{originalRupees}</span>
            <span className="text-lg font-bold text-green-600">₹{discountedRupees}</span>
          </span>
        </div>
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-500">Registration</span>
          <span>{competition.registration_start} से {competition.registration_end}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Competition Date</span>
          <span className="font-medium">{competition.competition_date}</span>
        </div>
      </div>

      {registered && competition.status === "live" ? (
        <Link href="/competition/play" className="block text-center bg-orange-500 text-white font-semibold py-3 rounded-lg">▶ Competition शुरू करें</Link>
      ) : registered ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 text-center">
          ✓ आप register हो चुके हैं! Payment confirmation का इंतज़ार करें।
        </div>
      ) : (
        <button type="button" onClick={handleRegister} disabled={registering} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
          {registering ? "Registering..." : "Register करें — ₹" + discountedRupees}
        </button>
      )}

      {message ? <p className="text-sm text-orange-600 mt-3 text-center">{message}</p> : null}

      <p className="text-xs text-gray-400 mt-4 text-center">Top 3 सबसे ज़्यादा सही जवाब देने वालों को Cash Prize मिलेगा। Payment अभी manually verify होती है — जल्द ही online payment जुड़ेगा।</p>
    </div>
  );
}
