"use client";
import { useEffect, useState } from "react";

type Profile = { skills: string[]; dream: string | null; bio: string | null };

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  communication: ["Public Speaking practice करें weekly", "हर दिन 5 मिनट खुद को video में बोलते हुए record करें"],
  excel: ["Advanced formulas (VLOOKUP, Pivot Tables) सीखें", "एक real dataset पर practice project बनाएं"],
  coding: ["एक छोटा project GitHub पर publish करें", "रोज़ 30 मिनट DSA practice करें"],
  design: ["Canva/Figma पर एक portfolio piece बनाएं", "किसी real brand के लिए mock redesign करें"],
};

function getGenericTips(dream: string | null) {
  const base = [
    "अपने resume में हर हफ्ते एक नई skill या project जोड़ें",
    "LinkedIn profile को हर महीने update करते रहें",
    "अपने field के 2-3 लोगों को follow/connect करें और उनसे सीखें",
  ];
  if (dream) {
    base.unshift("आपका लक्ष्य \"" + dream + "\" है — इसके लिए ज़रूरी skills profile में track करें");
  }
  return base;
}

export default function CareerCoach() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, []);

  const skillTips: string[] = [];
  if (profile?.skills) {
    for (const skill of profile.skills) {
      const key = skill.toLowerCase();
      for (const matchKey of Object.keys(SKILL_SUGGESTIONS)) {
        if (key.includes(matchKey)) {
          skillTips.push(...SKILL_SUGGESTIONS[matchKey]);
        }
      }
    }
  }

  const genericTips = getGenericTips(profile?.dream ?? null);

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <p className="text-sm font-semibold mb-1">🎯 आपके लिए Career Tips</p>
        <p className="text-xs text-gray-500">आपकी Profile में जो skills/dream है, उसी हिसाब से</p>
      </div>

      {skillTips.length > 0 ? (
        <div>
          <p className="text-sm font-medium mb-2">आपकी Skills के आधार पर</p>
          <div className="space-y-2">
            {skillTips.map((tip, i) => {
              return (
                <div key={i} className="flex gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2">
                  <span>💡</span>
                  <span>{tip}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-sm font-medium mb-2">General Tips</p>
        <div className="space-y-2">
          {genericTips.map((tip, i) => {
            return (
              <div key={i} className="flex gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2">
                <span>✅</span>
                <span>{tip}</span>
              </div>
            );
          })}
        </div>
      </div>

      {(!profile?.skills || profile.skills.length === 0) ? (
        <p className="text-xs text-gray-400 text-center">Profile में Skills जोड़ें, तो और specific tips मिलेंगी</p>
      ) : null}
    </div>
  );
}
