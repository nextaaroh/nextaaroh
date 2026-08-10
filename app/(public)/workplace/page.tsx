"use client";
import { useEffect, useState } from "react";
import WorkplaceCard from "@/features/workplace/components/WorkplaceCard";

type Listing = { id: string; title: string; category: string; organization: string; location: string | null };

export default function WorkplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/workplace")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setListings(data?.data ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-lg font-bold mb-3">Workplace</h1>
      {loading ? <p className="text-center text-gray-400 text-sm py-8">Loading...</p> : null}
      {!loading && listings.length === 0 ? <p className="text-center text-gray-400 text-sm py-8">अभी कोई listing उपलब्ध नहीं है</p> : null}
      <div className="space-y-3">
        {listings.map((listing) => {
          return <WorkplaceCard key={listing.id} listing={listing} />;
        })}
      </div>
    </div>
  );
}
