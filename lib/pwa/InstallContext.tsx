"use client";
import { createContext, useContext, useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallContextValue = { canInstall: boolean; install: () => Promise<void> };
const InstallContext = createContext<InstallContextValue>({ canInstall: false, install: async () => {} });

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    function handleInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  return <InstallContext.Provider value={{ canInstall: !installed && !!deferredPrompt, install }}>{children}</InstallContext.Provider>;
}

export function useInstall() {
  return useContext(InstallContext);
}
