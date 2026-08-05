"use client";
import { useEffect, useState } from "react";

type Website = {
  id: string;
  title: string;
  url: string;
  category: string | null;
  description?: string; // Naya field add kiya gaya hai jankari ke liye
};

const FALLBACK_WEBSITES: Website[] = [
  { 
    id: "1", 
    title: "NCERT Official Website", 
    url: "https://ncert.nic.in", 
    category: "Study Material",
    description: "Download free PDF textbooks for classes 1 to 12 and access official study materials."
  },
  { 
    id: "2", 
    title: "SWAYAM — Free Online Courses", 
    url: "https://swayam.gov.in", 
    category: "Free Courses",
    description: "Government of India's portal offering free online courses and certifications from top educators."
  },
  { 
    id: "3", 
    title: "DIKSHA — NCERT Learning App", 
    url: "https://diksha.gov.in", 
    category: "Study Material",
    description: "National Digital Infrastructure for Teachers and Students offering interactive learning content."
  },
  { 
    id: "4", 
    title: "MyGov India", 
    url: "https://www.mygov.in", 
    category: "Govt Schemes & Updates",
    description: "Stay updated with government schemes, citizen engagement activities, and national campaigns."
  },
  { 
    id: "5", 
    title: "National Career Service", 
    url: "https://www.ncs.gov.in", 
    category: "Jobs",
    description: "A government initiative connecting job seekers with employers and offering career counseling."
  },
  { 
    id: "6", 
    title: "Apna — Job Search", 
    url: "https://apna.co", 
    category: "Jobs",
    description: "One of India's largest professional networking and job search platforms for local jobs."
  },
  { 
    id: "7", 
    title: "Internshala", 
    url: "https://internshala.com", 
    category: "Internships",
    description: "Find internships and fresher jobs across various domains with stipends."
  },
  { 
    id: "8", 
    title: "National Scholarship Portal", 
    url: "https://scholarships.gov.in", 
    category: "Scholarships",
    description: "Apply for various central and state government scholarships easily through a single portal."
  },
  { 
    id: "9", 
    title: "UPSC Official Website", 
    url: "https://upsc.gov.in", 
    category: "Govt Exams",
    description: "Official portal for Civil Services examinations, notifications, and results."
  },
  { 
    id: "10", 
    title: "Khan Academy", 
    url: "https://www.khanacademy.org", 
    category: "Free Courses",
    description: "Free world-class education for anyone, anywhere with practice exercises and videos."
  },
];

export default function TopWebsitesList() {
  const [sites, setSites] = useState<Website[]>([]);
  // Expand/Collapse track karne ke liye state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/websites/top-50")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = (data?.data ?? []).slice(0, 10);
        setSites(list.length > 0 ? list : FALLBACK_WEBSITES);
      })
      .catch(() => setSites(FALLBACK_WEBSITES));
  }, []);

  const toggleExpand = (id: string) => {
    // Agar same item par click kiya toh band ho jayega, warna naya khulega
    setExpandedId(expandedId === id ? null : id);
  };

  if (sites.length === 0) return null;

  return (
    <div className="my-6 px-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">Top 10 Websites</h2>
        <p className="text-sm text-gray-500">For Jobs, Study & Career Growth</p>
      </div>

      <div className="space-y-3">
        {sites.map((site, index) => {
          const isExpanded = expandedId === site.id;

          return (
            <div 
              key={site.id} 
              className={`border transition-all duration-200 rounded-xl overflow-hidden ${
                isExpanded ? "border-blue-300 shadow-md" : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {/* Tapable Header */}
              <button 
                onClick={() => toggleExpand(site.id)}
                className="w-full flex items-center gap-4 bg-white px-4 py-3 text-left focus:outline-none"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  isExpanded ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <p className={`text-base font-semibold ${isExpanded ? "text-blue-700" : "text-gray-800"}`}>
                    {site.title}
                  </p>
                  {site.category && (
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full uppercase tracking-wider">
                      {site.category}
                    </span>
                  )}
                </div>

                {/* Arrow Icon */}
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expandable Details Section */}
              {isExpanded && (
                <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {site.description || "Click below to visit the official website and explore more details."}
                  </p>
                  
                  <a 
                    href={site.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center"
                  >
                    Visit Website
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
