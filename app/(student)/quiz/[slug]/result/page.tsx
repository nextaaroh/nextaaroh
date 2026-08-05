"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score") ?? "0";
  const total = searchParams.get("total") ?? "0";

  return (
    <div className="max-w-md mx-auto p-4 text-center pt-10">
      <p className="text-5xl mb-3">🎉</p>
      <h1 className="text-xl font-bold mb-2">Quiz पूरा हुआ!</h1>
      <p className="text-gray-600 mb-6">
        आपने <span className="font-bold text-orange-600">{score}</span> points में से{" "}
        <span className="font-bold">{total}</span> questions में स्कोर किया
      </p>
      <div className="flex gap-2">
        <Link href="/quiz" className="flex-1 border border-orange-500 text-orange-500 font-medium py-2.5 rounded-lg text-sm">
          और Quiz खेलें
        </Link>
        <Link href="/dashboard" className="flex-1 bg-orange-500 text-white font-medium py-2.5 rounded-lg text-sm">
          Dashboard
        </Link>
      </div>
    </div>
  );
}