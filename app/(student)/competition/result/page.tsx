"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CompetitionResultContent() {
  const searchParams = useSearchParams();

  const correct = searchParams.get("correct") ?? "0";
  const total = searchParams.get("total") ?? "25";

  return (
    <div className="max-w-md mx-auto p-4 text-center pt-10">
      <p className="text-5xl mb-3">🏆</p>

      <h1 className="text-xl font-bold mb-2">
        Competition पूरा हुआ!
      </h1>

      <p className="text-gray-600 mb-6">
        आपने{" "}
        <span className="font-bold text-orange-600">
          {correct}
        </span>{" "}
        में से{" "}
        <span className="font-bold">
          {total}
        </span>{" "}
        सही जवाब दिए
      </p>

      <p className="text-xs text-gray-400 mb-6">
        Winners का ऐलान Admin द्वारा किया जाएगा — Top 3 को Cash Prize मिलेगा।
      </p>

      <Link
        href="/dashboard"
        className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-lg"
      >
        Dashboard पर जाएं
      </Link>
    </div>
  );
}

export default function CompetitionResultPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto p-4 text-center pt-10">
          <p className="text-sm text-gray-500">
            Result loading...
          </p>
        </div>
      }
    >
      <CompetitionResultContent />
    </Suspense>
  );
}
