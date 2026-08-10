"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Competition = {
  title: string;
  discounted_fee_paise: number;
  entry_fee_paise: number;
  registration_end: string;
  competition_date: string;
};

export default function CompetitionBanner() {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    fetch("/api/v1/competition")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.competition) {
          setCompetition(data.competition);
          const end = new Date(data.competition.registration_end).getTime();
          const diff = Math.max(Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24)), 0);
          setDaysLeft(diff);
        }
      })
      .catch(() => {});
  }, []);

  if (!competition) return null;

  const discounted = (competition.discounted_fee_paise / 100).toFixed(0);
  const original = (competition.entry_fee_paise / 100).toFixed(0);

  return (
    <div className="px-4 my-4">
      <Link href="/competition" className="block bg-gradient-to-r from-purple-700 via-purple-600 to-orange-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">🏆 Quiz Competition</span>
          {daysLeft > 0 ? <span className="text-xs font-medium">{daysLeft} दिन बचे Registration में</span> : null}
        </div>
        <p className="font-bold text-base mb-1">{competition.title}</p>
        <p className="text-sm">
          Entry सिर्फ <span className="line-through opacity-70">₹{original}</span> <span className="font-bold">₹{discounted}</span> — Winners को Cash Prize!
        </p>
        <span className="inline-block mt-2 bg-white text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full">Register करें →</span>
      </Link>
    </div>
  );
}
