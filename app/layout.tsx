import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import TrafficTracker from "@/components/TrafficTracker";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { InstallProvider } from "@/lib/pwa/InstallContext";

export const metadata: Metadata = {
  title: "NextAaroh – Digital Skills, AI & Freelancing",
  description: "Learn digital skills, use AI effectively, and start freelancing with NextAaroh. Build practical skills for career growth, jobs and entrepreneurship.",
  manifest: "/manifest.json",
  themeColor: "#0a1a3a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  other: {
    "google-adsense-account": "ca-pub-9090589506290519",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="pb-16 md:pb-0">
        <InstallProvider>
          <LanguageProvider>
            <SplashScreen />
            <TrafficTracker />
            <Header />
            <main>{children}</main>
            <Footer />
            <BottomNav />
            <ServiceWorkerRegister />
          </LanguageProvider>
        </InstallProvider>
      </body>
    </html>
  );
}
