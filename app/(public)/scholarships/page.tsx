"use client";
import { useEffect, useState } from "react";
import ScholarshipCard from "@/features/scholarships/components/ScholarshipCard";

const FALLBACK: { id: string; slug: string; title: string; provider: string; deadline: string | null; official_url: string }[] = [
  { id: "1", slug: "nsp", title: "National Scholarship Portal — All Govt. Scholarships", provider: "Government of India", deadline: null, official_url: "https://scholarships.gov.in" },
  { id: "2", slug: "aicte-pragati", title: "AICTE Pragati Scholarship for Girls (₹50,000/year)", provider: "AICTE", deadline: "31 October", official_url: "https://scholarships.gov.in" },
  { id: "3", slug: "inspire", title: "INSPIRE Scholarship for Science Students", provider: "Dept. of Science & Technology", deadline: null, official_url: "https://online-inspire.gov.in" },
];

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/scholarships")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = data?.data ?? [];
        if (list.length > 0) setScholarships(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-lg font-bold mb-3">Scholarships</h1>
      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      <div className="space-y-3">
        {scholarships.map((s) => {
          return <ScholarshipCard key={s.id} scholarship={s} />;
        })}
      </div>
    </div>
  );
}
