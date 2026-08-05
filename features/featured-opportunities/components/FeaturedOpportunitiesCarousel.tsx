"use client";
import { useEffect, useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  company: string;
  banner_image_url: string | null;
  official_url: string;
};

export default function FeaturedOpportunitiesCarousel() {
  const [items, setItems] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetch("/api/v1/featured-opportunities")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setItems(data?.data ?? []))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="my-4">
      <h2 className="text-sm font-semibold px-4 mb-2">Featured Opportunities</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {items.map((item) => {
          return (
            <a key={item.id} href={item.official_url} target="_blank" rel="noopener noreferrer" className="shrink-0 w-64 rounded-lg border border-gray-200 overflow-hidden">
              {item.banner_image_url ? <img src={item.banner_image_url} alt={item.title} className="w-full h-28 object-cover" /> : null}
              <div className="p-3">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.company}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}