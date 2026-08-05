"use client";
import { useState } from "react";

type Scholarship = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  deadline: string | null;
  official_url: string;
};

export default function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/v1/scholarships/" + scholarship.id + "/save", { method: "POST" });
      setSaved(true);
    } catch {
      // silently ignore for now
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-medium text-sm">{scholarship.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{scholarship.provider}</p>
          {scholarship.deadline ? <p className="text-xs text-gray-400 mt-1">Deadline: {scholarship.deadline}</p> : null}
        </div>
        <button type="button" onClick={handleSave} disabled={saving || saved} className="text-xl shrink-0">
          {saved ? "❤️" : "🤍"}
        </button>
      </div>
      <a href={scholarship.official_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs bg-orange-500 text-white font-medium px-4 py-2 rounded-lg">
        View Details
      </a>
    </div>
  );
}