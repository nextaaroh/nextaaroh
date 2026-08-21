"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeHero() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setLoggedIn(!!data);
        setRole(data?.role ?? null);
      })
      .catch(() => setLoggedIn(false));
  }, []);

  const isEducator = role === "educator" || role === "admin" || role === "super_admin";

  return (
    <div className="bg-[#0a1a3a] text-white px-4 py-10 text-center">
      <p className="text-xs uppercase tracking-widest text-orange-400 mb-2 font-semibold">NextAaroh</p>
      <h1 className="text-2xl font-bold mb-2 leading-snug">Learn Skills. Build Yourself. Find Opportunities.</h1>
      <p className="text-white/70 text-xs max-w-sm mx-auto mb-6">
        Practical skills, career resources, opportunities and tools for the next generation.
      </p>

      {loggedIn === false ? (
        <>
          <Link href="/signup" className="inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-full mb-3">
            मुफ़्त में शुरू करें
          </Link>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/learning" className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-full">Explore Skills</Link>
            <Link href="/opportunities" className="inline-block border border-white/30 text-white font-semibold px-6 py-3 rounded-full">Find Opportunities</Link>
          </div>
        </>
      ) : null}

      {loggedIn === true ? (
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/dashboard" className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-full">📊 Dashboard</Link>
          <Link href="/learning" className="inline-block border border-white/30 text-white font-semibold px-6 py-3 rounded-full">🎬 Learning</Link>
          {isEducator ? (
            <Link href="/educator-dashboard" className="inline-block bg-purple-600 text-white font-semibold px-6 py-3 rounded-full">🎓 Educator Dashboard</Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
