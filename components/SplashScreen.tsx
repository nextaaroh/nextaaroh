"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("nsi_splash_shown");
    if (alreadyShown) return;

    setVisible(true);
    sessionStorage.setItem("nsi_splash_shown", "1");

    const fadeTimer = setTimeout(() => setFadeOut(true), 1400);
    const removeTimer = setTimeout(() => setVisible(false), 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a1a3a] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-splash-logo">
        <Image src="/brand/logo-64.png" alt="NextAaroh" width={120} height={120} priority />
      </div>
      <p className="text-white font-bold text-lg mt-4 tracking-wide animate-splash-text">
        Next<span className="text-orange-500">Aaroh</span>
      </p>
      <p className="text-white/60 text-xs mt-1 animate-splash-text">
        SKILLS · LEADERSHIP · OPPORTUNITY
      </p>
    </div>
  );
}
