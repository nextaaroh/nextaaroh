"use client";
import { useEffect, useState } from "react";

type Stats = {
  hours_learned: number;
  quizzes_completed: number;
  certificates_earned: number;
  jobs_applied: number;
  skills_count: number;
  points_balance: number;
};

const CARDS: { key: keyof Stats; label: string; emoji: string; suffix?: string }[] = [
  { key: "hours_learned", label: "Hours Learned", emoji: "⏱️", suffix: "hrs" },
  { key: "quizzes_completed", label: "Quizzes Completed", emoji: "📝" },
  { key: "certificates_earned", label: "Certificates Earned", emoji: "🏅" },
  { key: "jobs_applied", label: "Jobs Applied", emoji: "🎯" },
  { key: "skills_count", label: "Skills Added", emoji: "🛠️" },
  { key: "points_balance", label: "Total Points", emoji: "⭐" },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/v1/me/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const maxSkills = 10;
  const skillsProgress = stats ? Math.min((stats.skills_count / maxSkills) * 100, 100) : 0;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">My Analytics</h1>

      {!stats ? <p className="text-gray-400 text-sm">Loading...</p> : null}

      {stats ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {CARDS.map((card) => {
              return (
                <div key={card.key} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-2xl mb-1">{card.emoji}</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats[card.key]}{card.suffix ? " " + card.suffix : ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold mb-2">Skills Growth</p>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-1">
              <div className="bg-orange-500 h-3 rounded-full transition-all" style={{ width: skillsProgress + "%" }} />
            </div>
            <p className="text-xs text-gray-400">{stats.skills_count} / {maxSkills} skills — Profile में और skills जोड़ें ताकि growth बढ़े</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
