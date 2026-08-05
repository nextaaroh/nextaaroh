"use client";
import { useEffect, useState } from "react";
import ScholarshipCard from "@/features/scholarships/components/ScholarshipCard";

type Scholarship = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  deadline: string | null;
  official_url: string;
};

const FALLBACK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "1",
    slug: "nsp-all-schemes",
    title: "National Scholarship Portal — All Govt. Scholarships",
    provider: "Government of India",
    deadline: null,
    official_url: "https://scholarships.gov.in",
  },
  {
    id: "2",
    slug: "aicte-pragati-girls",
    title: "AICTE Pragati Scholarship for Girls (₹50,000/year)",
    provider: "AICTE",
    deadline: "31 October",
    official_url: "https://scholarships.gov.in",
  },
  {
    id: "3",
    slug: "inspire-scholarship",
    title: "INSPIRE Scholarship for Science Students",
    provider: "Dept. of Science & Technology",
    deadline: null,
    official_url: "https://online-inspire.gov.in",
  },
  {
    id: "4",
    slug: "post-matric-sc-st-obc",
    title: "Post Matric Scholarship (SC/ST/OBC)",
    provider: "Ministry of Social Justice & Empowerment",
    deadline: null,
    official_url: "https://scholarships.gov.in",
  },
];

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/scholarships")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = data?.data ?? [];
        setScholarships(list.length > 0 ? list : FALLBACK_SCHOLARSHIPS);
      })
      .catch(() => setScholarships(FALLBACK_SCHOLARSHIPS))
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