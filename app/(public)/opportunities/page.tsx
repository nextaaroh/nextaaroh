"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import OpportunityCard from "@/features/opportunities/components/OpportunityCard";

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: string;
  last_date: string;
  apply_link: string;
};

const FALLBACK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "f1",
    title: "Internships across India — All Fields",
    organization: "Internshala",
    category: "internship",
    last_date: "Ongoing",
    apply_link: "https://internshala.com",
  },
  {
    id: "f2",
    title: "Fresher & Entry-Level Jobs Near You",
    organization: "Apna App",
    category: "job",
    last_date: "Ongoing",
    apply_link: "https://apna.co",
  },
  {
    id: "f3",
    title: "Blinkit Picker Onboarding — Apply Now",
    organization: "Blinkit",
    category: "job",
    last_date: "Ongoing",
    apply_link: "https://play.google.com/store/apps/details?id=com.blinkit.storeob&hl=en_IN",
  },
  {
    id: "f4",
    title: "Govt Jobs Listing — All States",
    organization: "National Career Service",
    category: "job",
    last_date: "Ongoing",
    apply_link: "https://www.ncs.gov.in",
  },
  {
    id: "f5",
    title: "National Scholarship Portal — All Schemes",
    organization: "Govt of India",
    category: "scholarship",
    last_date: "Ongoing",
    apply_link: "https://scholarships.gov.in",
  },
];

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "job", label: "Jobs" },
  { value: "internship", label: "Internships" },
  { value: "scholarship", label: "Scholarships" },
  { value: "competition", label: "Competitions" },
];

export default function OpportunitiesPage() {
  const [category, setCategory] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = category ? "?category=" + category : "";
    fetch("/api/v1/opportunities" + query)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = data?.data ?? [];
        const source = list.length > 0 ? list : FALLBACK_OPPORTUNITIES;
        const filtered = category ? source.filter((o: Opportunity) => o.category === category) : source;
        setOpportunities(filtered);
      })
      .catch(() => {
        const filtered = category ? FALLBACK_OPPORTUNITIES.filter((o) => o.category === category) : FALLBACK_OPPORTUNITIES;
        setOpportunities(filtered);
      })
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold">Opportunities</h1>
        <Link href="/opportunities/submit" className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          + Submit
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={
                isActive
                  ? "shrink-0 text-xs font-medium bg-orange-500 text-white rounded-full px-3 py-1.5"
                  : "shrink-0 text-xs font-medium bg-gray-100 text-gray-600 rounded-full px-3 py-1.5"
              }
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && opportunities.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">इस category में अभी कोई opportunity नहीं है</p>
      ) : null}

      <div className="space-y-3">
        {opportunities.map((opp) => {
          return <OpportunityCard key={opp.id} opportunity={opp} />;
        })}
      </div>
    </div>
  );
}