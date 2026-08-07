"use client";
import { useEffect, useState } from "react";

type Badge = { code: string; emoji: string; title: string; desc: string; earned: boolean };
type GamificationData = { xp: number; level: number; title: string; nextAt: number | null; badges: Badge[] };

export default function GamificationCard() {
  const [data, setData] = useState<GamificationData | null>(null);

  useEffect(() => {
    fetch("/api/v1/me/gamification")
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => setData(result))
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  const progress = data.nextAt ? Math.min((data.xp / data.nextAt) * 100, 100) : 100;
  const earnedBadges = data.badges.filter((b) => b.earned);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-br from-purple-600 to-orange-500 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs opacity-80">Level {data.level}</p>
            <p className="text-lg font-bold">{data.title}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">XP</p>
            <p className="text-lg font-bold">{data.xp}</p>
          </div>
        </div>
        {data.nextAt ? (
          <>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all" style={{ width: progress + "%" }} />
            </div>
            <p className="text-[10px] opacity-70 mt-1">{data.nextAt - data.xp} XP से अगला level</p>
          </>
        ) : (
          <p className="text-[10px] opacity-70 mt-1">🎉 सबसे ऊंचा level पहुंच गए!</p>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm font-semibold mb-3">Badges ({earnedBadges.length}/{data.badges.length})</p>
        <div className="grid grid-cols-5 gap-2">
          {data.badges.map((badge) => {
            return (
              <div key={badge.code} className="flex flex-col items-center gap-1" title={badge.desc}>
                <div className={"w-11 h-11 rounded-full flex items-center justify-center text-xl " + (badge.earned ? "bg-orange-100" : "bg-gray-100 grayscale opacity-40")}>
                  {badge.emoji}
                </div>
                <p className={"text-[9px] text-center leading-tight " + (badge.earned ? "text-gray-700" : "text-gray-400")}>{badge.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
