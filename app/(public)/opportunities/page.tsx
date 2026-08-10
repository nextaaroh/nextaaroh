"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import OpportunityCard from "@/features/opportunities/components/OpportunityCard";

type Opportunity = { id: string; title: string; organization: string; category: string; last_date: string; apply_link: string };

export default function OpportunitiesPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/opportunities")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setItems(data?.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold">Opportunities</h1>
        <Link href="/opportunities/submit" className="text-sm text-orange-500 font-medium">+ Submit</Link>
      </div>
      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && items.length === 0 ? <p className="text-center text-gray-400 text-sm py-8">अभी कोई opportunity उपलब्ध नहीं है</p> : null}
      <div className="space-y-3">
        {items.map((opp) => {
          return <OpportunityCard key={opp.id} opportunity={opp} />;
        })}
      </div>
    </div>
  );
}
