"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      localStorage.setItem("creator_ref", ref);
      fetch("/api/v1/creator-club/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref }),
      }).finally(() => router.replace("/signup"));
    } else {
      router.replace("/signup");
    }
  }, [ref, router]);

  return <div className="max-w-md mx-auto p-4 text-sm text-gray-500 text-center mt-10">Redirecting...</div>;
}
