"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInstall } from "@/lib/pwa/InstallContext";

export default function Header() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const { canInstall, install } = useInstall();

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setLoggedIn(true);
          setPhotoUrl(data.photo_url ?? null);
          setRole(data.role ?? null);
        }
      })
      .catch(() => {});
  }, []);

  const isEducatorOrAdmin = role === "educator" || role === "admin" || role === "super_admin";

  return (
    <header className="sticky top-0 z-50 bg-[#0a1a3a] text-white">
      <div className="flex items-center justify-between px-4 py-3 gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/brand/logo-64.png" alt="NextAaroh" width={32} height={32} />
          <div className="leading-tight">
            <span className="font-bold text-base sm:text-lg whitespace-nowrap block">
              Next<span className="text-orange-500">Aaroh</span>
            </span>
            <span className="text-[9px] text-white/50 hidden sm:block">Learn Skills. Use AI. Start Freelancing.</span>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-xs">
          {canInstall ? (
            <button type="button" onClick={install} className="bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
              📲 Install
            </button>
          ) : null}
          <Link href="/digital-products">Digital Products</Link>
          <Link href="/website-service">Website Services</Link>
          <Link href="/me" className="flex items-center gap-1.5">
            {loggedIn && photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-7 h-7 rounded-full object-cover ring-1 ring-white/30" />
            ) : loggedIn ? (
              <span className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">👤</span>
            ) : (
              "Profile"
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
