"use client";
import { useState, useRef } from "react";
import PricingCard from "@/features/website-service/components/PricingCard";
import WebsiteRequestForm from "@/features/website-service/components/WebsiteRequestForm";

const WHAT_YOU_GET = ["⚡ Fast & Responsive", "📱 Mobile Friendly", "🟢 WhatsApp Integration", "📍 Google Maps", "🖼️ Business Gallery", "🔍 Basic SEO", "🎨 Professional Design", "🚀 Fast Loading"];
const WHO_CAN_GET = ["Local Businesses", "Shops", "Salons", "Gyms", "Coaching Classes", "Restaurants", "Hotels", "Freelancers", "Photographers", "Real Estate", "Service Providers", "Personal Brands"];
const FAQS = [
  { q: "Kya ₹999 me website ban jayegi?", a: "Haan, Starter package me 1-page professional business website milegi." },
  { q: "Kya 2-page website available hai?", a: "Haan, Business package ₹1,999 me 2-page website available hai." },
  { q: "Kya database chahiye?", a: "Basic informational website ke liye database ki zarurat nahi hoti." },
  { q: "Kya WhatsApp button hoga?", a: "Haan." },
  { q: "Kya Google Maps add kar sakte hain?", a: "Haan." },
  { q: "Kya client baad me photos change kar sakta hai?", a: "Basic package me content updates NextAaroh team ke through kiye jayenge. Admin panel/dynamic editing ki requirement ho to custom package provide kiya jayega." },
  { q: "Kya custom website ban sakti hai?", a: "Haan. Custom requirements ke liye quotation requirements ke according diya jayega." },
];

export default function WebsiteServicePage() {
  const [selectedPackage, setSelectedPackage] = useState("starter");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function selectAndScroll(pkg: string) {
    setSelectedPackage(pkg);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      <div className="bg-[#0a1a3a] text-white px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">Apne Business Ko Online Le Jao 🚀</h1>
        <p className="text-orange-400 font-semibold text-sm mb-3">Professional 1–2 Page Website — Simple, Fast & Affordable</p>
        <p className="text-white/70 text-xs max-w-sm mx-auto">
          Apne business, shop, coaching, salon, gym, restaurant, service ya personal brand ke liye ek professional website banwayein.
        </p>
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl p-4 mb-6 text-center">
          <p className="text-sm font-bold mb-1">🎁 Launch Offer</p>
          <p className="text-xs mb-2">First 10 Businesses Ke Liye Special Pricing</p>
          <p className="text-xs">Starter: ₹999 · Business: ₹1,999 · Pro: ₹3,999</p>
          <p className="text-[10px] mt-2 opacity-80">Limited Slots Available</p>
        </div>

        <div className="space-y-4 mb-8">
          <PricingCard emoji="🟢" name="Starter Website" price="₹999" cta="₹999 Me Website Banwayein" onSelect={() => selectAndScroll("starter")}
            features={["1-page professional website", "Business information + About + Services", "Gallery", "WhatsApp + Call button", "Google Maps", "Mobile responsive", "Basic SEO setup"]} />
          <PricingCard emoji="🔵" name="Business Website" price="₹1,999" popular cta="₹1,999 Me Website Banwayein" onSelect={() => selectAndScroll("business")}
            features={["2-page website (Home + About/Services)", "Professional design", "Business gallery", "WhatsApp + Call buttons", "Google Maps + Social links", "Mobile responsive, Basic SEO", "Fast-loading design"]} />
          <PricingCard emoji="🟣" name="Business Pro" price="₹3,999" cta="Pro Website Banwayein" onSelect={() => selectAndScroll("pro")}
            features={["Up to 4 pages", "Premium design + Advanced sections", "Gallery + Social integration", "WhatsApp + Call + Google Maps", "More customization", "Professional animations", "Mobile responsive"]} />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 mb-3">
          <strong>Basic Website kaise kaam karegi?</strong><br />
          Website me aapke business ki information, services, photos, contact details aur other content professionally display kiya jayega. Future me photos/content update करना हो to NextAaroh team update कर सकती है।
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-800 mb-8">
          <strong>Dynamic Website:</strong> Admin panel aur dynamic features ki requirement hone par custom quotation diya jayega.
        </div>

        <h2 className="text-base font-bold mb-3">What You Get</h2>
        <div className="grid grid-cols-2 gap-2 mb-8">
          {WHAT_YOU_GET.map((item) => {
            return <div key={item} className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-center">{item}</div>;
          })}
        </div>

        <h2 className="text-base font-bold mb-3">Who Can Get A Website?</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {WHO_CAN_GET.map((item) => {
            return <span key={item} className="bg-orange-100 text-orange-700 text-xs px-3 py-1.5 rounded-full">{item}</span>;
          })}
        </div>

        <h2 className="text-base font-bold mb-3">FAQ</h2>
        <div className="space-y-2 mb-8">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium">
                  {faq.q}<span className="text-gray-400">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen ? <p className="px-4 pb-3 text-xs text-gray-600">{faq.a}</p> : null}
              </div>
            );
          })}
        </div>

        <div ref={formRef} className="border border-gray-200 rounded-xl p-4 bg-white">
          <WebsiteRequestForm defaultPackage={selectedPackage} key={selectedPackage} />
        </div>
      </div>
    </div>
  );
}
