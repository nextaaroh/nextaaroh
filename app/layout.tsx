import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import TrafficTracker from "@/components/TrafficTracker";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "NextAaroh — Skills, Leadership, Employment & Entrepreneurship",
  description: "Empowering youth with skills, leadership, employment and entrepreneurship opportunities.",
  manifest: "/manifest.json",
  themeColor: "#0a1a3a",
  other: {
    "google-adsense-account": "ca-pub-9090589506290519",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="pb-16 md:pb-0">
        <LanguageProvider>
          <SplashScreen />
          <TrafficTracker />
          <Header />
          <main>{children}</main>
          <Footer />
          <BottomNav />
          <InstallPrompt />
          <ServiceWorkerRegister />
        </LanguageProvider>
      </body>
    </html>
  );
}
