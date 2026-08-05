import Link from "next/link";

type Listing = {
  id: string;
  slug: string;
  title: string;
  category: string;
  organization: string;
  location: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  internship: "Internship",
  part_time: "Part-Time",
  freelancing: "Freelancing",
  remote_job: "Remote Job",
  campus_ambassador: "Campus Ambassador",
  volunteer: "Volunteer",
};

export default function WorkplaceCard({ listing }: { listing: Listing }) {
  return (
    <Link href={"/workplace/" + listing.slug} className="block border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-sm">{listing.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{listing.organization}</p>
          {listing.location ? <p className="text-xs text-gray-400 mt-1">📍 {listing.location}</p> : null}
        </div>
        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full shrink-0">
          {CATEGORY_LABELS[listing.category] ?? listing.category}
        </span>
      </div>
    </Link>
  );
}