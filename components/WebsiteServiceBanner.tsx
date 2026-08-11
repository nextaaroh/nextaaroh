import Link from "next/link";

export default function WebsiteServiceBanner() {
  return (
    <div className="px-4 my-4">
      <Link href="/website-service" className="block bg-gradient-to-r from-[#0a1a3a] to-purple-700 rounded-xl p-4 text-white">
        <p className="text-sm font-bold mb-1">Apne Business Ki Professional Website Banwayein</p>
        <p className="text-xs opacity-80 mb-3">Starting ₹999</p>
        <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">Get Your Website →</span>
      </Link>
    </div>
  );
}
