"use client";
import { useEffect, useState } from "react";
import WorkplaceCard from "@/features/workplace/components/WorkplaceCard";

type Listing = {
  id: string;
  slug: string;
  title: string;
  category: string;
  organization: string;
  location: string | null;
};

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "internship", label: "Internship" },
  { value: "part_time", label: "Part-Time" },
  { value: "freelancing", label: "Freelancing" },
  { value: "remote_job", label: "Remote" },
  { value: "campus_ambassador", label: "Campus Ambassador" },
  { value: "volunteer", label: "Volunteer" },
];

export default function WorkplacePage() {
  const [category, setCategory] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = category ? "?category=" + category : "";
    fetch("/api/v1/workplace" + query)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setListings(data?.data ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-lg font-bold mb-3">Workplace</h1>

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
      {!loading && listings.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">अभी कोई listing उपलब्ध नहीं है</p>
      ) : null}

      <div className="space-y-3">
        {listings.map((listing) => {
          return <WorkplaceCard key={listing.id} listing={listing} />;
        })}
      </div>
    </div>
  );
}