"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { LanguageCode } from "@/lib/i18n/translations";

const OPTIONS: { value: LanguageCode; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "हि" },
  { value: "hinglish", label: "Hg" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLanguage(opt.value)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition ${
            language === opt.value
              ? "bg-orange-500 text-white"
              : "text-white/70"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}