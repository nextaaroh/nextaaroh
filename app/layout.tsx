import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: "NextAaroh — Skills, Leadership, Employment & Entrepreneurship",
  description: "Empowering youth with skills, leadership, employment and entrepreneurship opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9090589506290519"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="pb-16 md:pb-0">
        <LanguageProvider>
          <SplashScreen />
          <Header />
          <main>{children}</main>
          <Footer />
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
