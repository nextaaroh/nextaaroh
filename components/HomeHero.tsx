"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HomeHero() {
  const { t } = useLanguage();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => setLoggedIn(res.ok))
      .catch(() => setLoggedIn(false));
  }, []);

  return (
    <div className="bg-[#0a1a3a] text-white px-4 py-10 text-center">
      <h1 className="text-2xl font-bold mb-2">
        Next<span className="text-orange-500">Aaroh</span>
      </h1>
      <p className="text-white/70 text-sm mb-6">Skills · Leadership · Opportunity</p>

      {loggedIn === false ? (
        <Link href="/signup" className="inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-full">
          {t("signup.submit")}
        </Link>
      ) : null}

      {loggedIn === true ? (
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-full">
            📊 Dashboard
          </Link>
          <Link href="/learning" className="inline-block border border-white/30 text-white font-semibold px-6 py-3 rounded-full">
            🎬 Learning
          </Link>
        </div>
      ) : null}
    </div>
  );
}
