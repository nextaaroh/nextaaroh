"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Listing = {
  title: string;
  organization: string;
  description: string;
  location: string | null;
  apply_link: string | null;
};

export default function WorkplaceDetailPage() {
  const params = useParams<{ slug: string }>();
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetch("/api/v1/workplace/" + params.slug)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setListing(data))
      .catch(() => setListing(null));
  }, [params.slug]);

  if (!listing) {
    return <p className="text-center text-gray-400 text-sm py-8">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold mb-1">{listing.title}</h1>
      <p className="text-sm text-gray-500 mb-1">{listing.organization}</p>
      {listing.location ? <p className="text-xs text-gray-400 mb-4">📍 {listing.location}</p> : null}
      <p className="text-sm text-gray-700 whitespace-pre-wrap mb-6">{listing.description}</p>
      {listing.apply_link ? (
  <a
    href={listing.apply_link}
    target="_blank"
    rel="noopener noreferrer"
    className="block text-center bg-orange-500 text-white font-semibold py-3 rounded-lg"
  >
    Apply Now
  </a>
) : null}
    </div>
  );
}