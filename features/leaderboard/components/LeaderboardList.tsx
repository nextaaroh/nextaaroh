"use client";
import { useEffect, useState } from "react";

type Entry = {
  rank: number;
  profile_id: string;
  username: string;
  points: number;
};

const PERIODS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "lifetime", label: "All Time" },
];

export default function LeaderboardList() {
  const [period, setPeriod] = useState("weekly");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/leaderboard?period=" + period + "&cohort=global")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setEntries(data?.data ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-3">Leaderboard</h1>

      <div className="flex gap-2 mb-4">
        {PERIODS.map((p) => {
          const isActive = period === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={
                isActive
                  ? "flex-1 bg-orange-500 text-white text-sm font-medium py-2 rounded-lg"
                  : "flex-1 bg-gray-100 text-gray-600 text-sm font-medium py-2 rounded-lg"
              }
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && entries.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">अभी कोई ranking उपलब्ध नहीं है</p>
      ) : null}

      <div className="space-y-2">
        {entries.map((entry) => {
          const medal = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : null;
          return (
            <div key={entry.profile_id} className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2.5">
              <span className="text-sm font-bold w-6 text-gray-500">{medal ?? entry.rank}</span>
              <span className="flex-1 text-sm font-medium">@{entry.username}</span>
              <span className="text-sm font-bold text-orange-600">{entry.points} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}