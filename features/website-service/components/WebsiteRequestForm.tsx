"use client";
import { useState } from "react";

const CATEGORIES = ["Shop", "Salon", "Gym", "Coaching", "Restaurant/Cafe", "Hotel", "Real Estate", "Photographer", "Freelancer", "Service Business", "Other"];
const PACKAGES = [
  { value: "starter", label: "Starter — ₹999" },
  { value: "business", label: "Business — ₹1,999" },
  { value: "pro", label: "Business Pro — ₹3,999" },
  { value: "custom", label: "Custom Website — Custom Quote" },
];

export default function WebsiteRequestForm({ defaultPackage }: { defaultPackage?: string }) {
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [pkg, setPkg] = useState(defaultPackage ?? PACKAGES[0].value);
  const [requiredPages, setRequiredPages] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState("");
  const [address, setAddress] = useState("");
  const [mapsLocation, setMapsLocation] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [websiteWhatsapp, setWebsiteWhatsapp] = useState("");
  const [hasLogo, setHasLogo] = useState("No");
  const [hasPhotos, setHasPhotos] = useState("No");
  const [additional, setAdditional] = useState("");
  const [contactMethod, setContactMethod] = useState("WhatsApp");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !businessName.trim() || !whatsapp.trim() || !confirmed) {
      setError("Full Name, Business Name, WhatsApp Number भरें और confirmation checkbox चुनें");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/website-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName, business_name: businessName, whatsapp_number: whatsapp, email,
          business_category: category, package: pkg, required_pages: requiredPages,
          business_description: description, services_products: services, business_address: address,
          google_maps_location: mapsLocation, social_link: socialLink, website_whatsapp_number: websiteWhatsapp,
          has_logo: hasLogo, has_photos: hasPhotos, additional_requirements: additional, preferred_contact_method: contactMethod,
        }),
      });
      if (!res.ok) {
        setError("कुछ गलत हो गया, फिर कोशिश करें");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-3xl mb-2">🎉</p>
        <h3 className="font-bold text-lg mb-2">Request Submitted Successfully!</h3>
        <p className="text-sm text-gray-600 mb-4">Thank you for choosing NextAaroh. हमारी team आपसे जल्द contact करेगी।</p>
        <a href={"https://wa.me/919343988416"} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg">
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-base font-bold">Website Banwane Ke Liye Form Bharein</h3>
      <input className="input" placeholder="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <input className="input" placeholder="Business Name *" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
      <input className="input" placeholder="WhatsApp Number *" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
      <input className="input" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />

      <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => { return <option key={c} value={c}>{c}</option>; })}
      </select>

      <select className="input" value={pkg} onChange={(e) => setPkg(e.target.value)}>
        {PACKAGES.map((p) => { return <option key={p.value} value={p.value}>{p.label}</option>; })}
      </select>

      <input className="input" placeholder="Required Pages (e.g. Home, About, Contact)" value={requiredPages} onChange={(e) => setRequiredPages(e.target.value)} />
      <textarea className="input resize-none" rows={2} placeholder="About Business / Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <textarea className="input resize-none" rows={2} placeholder="Services / Products" value={services} onChange={(e) => setServices(e.target.value)} />
      <input className="input" placeholder="Business Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input className="input" placeholder="Google Maps Location (link)" value={mapsLocation} onChange={(e) => setMapsLocation(e.target.value)} />
      <input className="input" placeholder="Instagram/Facebook link" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} />
      <input className="input" placeholder="WhatsApp number for website" value={websiteWhatsapp} onChange={(e) => setWebsiteWhatsapp(e.target.value)} />

      <div>
        <label className="text-xs text-gray-500 block mb-1">Do you have a logo?</label>
        <select className="input" value={hasLogo} onChange={(e) => setHasLogo(e.target.value)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Do you have business photos?</label>
        <select className="input" value={hasPhotos} onChange={(e) => setHasPhotos(e.target.value)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <textarea className="input resize-none" rows={2} placeholder="Additional Requirements" value={additional} onChange={(e) => setAdditional(e.target.value)} />

      <div>
        <label className="text-xs text-gray-500 block mb-1">Preferred Contact Method</label>
        <select className="input" value={contactMethod} onChange={(e) => setContactMethod(e.target.value)}>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Phone Call">Phone Call</option>
          <option value="Email">Email</option>
        </select>
      </div>

      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
        I confirm that the information provided is correct.
      </label>

      {error ? <p className="text-red-600 text-xs">{error}</p> : null}

      <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit Website Request"}
      </button>
    </form>
  );
}
