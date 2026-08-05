"use client";
import { useEffect, useState } from "react";

type Learning = { title: string; body: string };

export default function DailyLearningCard() {
  const [learning, setLearning] = useState<Learning | null>(null);

  useEffect(() => {
    fetch("/api/v1/daily-learning")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setLearning(data))
      .catch(() => setLearning(null));
  }, []);

  return (
    <div className="mx-4 my-4 rounded-xl border border-gray-200 p-5">
      <p className="text-xs uppercase tracking-wide text-orange-500 mb-2">Today's Learning</p>
      {learning ? (
        <>
          <h3 className="font-semibold text-base mb-1">{learning.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{learning.body}</p>
        </>
      ) : (
        <p className="text-gray-400 text-sm">Sign up to see today's topic for your class</p>
      )}
    </div>
  );
}