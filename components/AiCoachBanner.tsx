import Link from "next/link";

export default function AiCoachBanner() {
  return (
    <div className="px-4 my-4">
      <Link href="/ai-coach" className="block bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">✨ New</p>
        <p className="font-bold text-base mb-1">AI Career & Communication Coach</p>
        <p className="text-xs opacity-90">Personalized tips और practice — अभी try करें →</p>
      </Link>
    </div>
  );
}
