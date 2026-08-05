"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { translations, type LanguageCode } from "./translations";

type ContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<ContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("nsi_language") as LanguageCode | null;
    if (saved && translations[saved]) setLanguageState(saved);
  }, []);

  function setLanguage(lang: LanguageCode) {
    setLanguageState(lang);
    localStorage.setItem("nsi_language", lang);
  }

  function t(key: string) {
    return translations[language][key] ?? translations.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}