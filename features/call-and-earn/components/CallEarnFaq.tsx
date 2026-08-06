"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Call & Earn कब से शुरू होगा?",
    a: "यह feature अभी build हो रहा है। Vyaktigat Vikas (VV) के साथ partnership अभी approval के स्टेज में है — जैसे ही यह confirm होगा, यहां details और join करने का तरीका अपडेट कर दिया जाएगा।",
  },
  {
    q: "क्या अभी यह official partnership है?",
    a: "नहीं, अभी तक कोई official partnership confirm नहीं हुई है। यह section सिर्फ आने वाले feature की जानकारी देने के लिए है।",
  },
  {
    q: "कैसे पता चलेगा जब यह live हो जाए?",
    a: "Notifications के ज़रिए और इसी page पर अपडेट मिलेगा। नीचे \"Notify Me\" जैसा option तैयार होते ही यहां जोड़ दिया जाएगा।",
  },
];

export default function CallEarnFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.q} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium"
            >
              {faq.q}
              <span className="text-gray-400 shrink-0 ml-2">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? <p className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">{faq.a}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
