import CallEarnFaq from "@/features/call-and-earn/components/CallEarnFaq";

const HOW_IT_WORKS = [
  { step: "1", title: "Apply / Register", desc: "अपनी details submit करें और eligibility check करें।" },
  { step: "2", title: "Verification", desc: "आपकी profile verify होने के बाद access मिलेगा।" },
  { step: "3", title: "Calls Attend करें", desc: "assigned calls/tasks को complete करें अपने समय के हिसाब से।" },
  { step: "4", title: "Earning पाएं", desc: "हर completed call/task के लिए earning आपके NextAaroh Wallet में जुड़ेगी।" },
];

const BENEFITS = [
  { emoji: "🕒", title: "Flexible Timing", desc: "अपनी सुविधा अनुसार समय चुनें, कोई fixed shift नहीं।" },
  { emoji: "💰", title: "Extra Earning", desc: "पढ़ाई/काम के साथ-साथ extra income का मौका।" },
  { emoji: "📈", title: "Skill Building", desc: "Communication और customer-handling skills बेहतर होंगी।" },
  { emoji: "🏠", title: "Work from Anywhere", desc: "घर बैठे भी कर सकते हैं, mobile या laptop से।" },
];

export default function CallAndEarnPage() {
  return (
    <div>
      <div className="bg-[#0a1a3a] text-white px-4 py-10 text-center">
        <span className="inline-block text-[10px] font-semibold bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full mb-3">
          Coming Soon · Partnership Pending Approval
        </span>
        <h1 className="text-2xl font-bold mb-2">Call & Earn</h1>
        <p className="text-white/70 text-sm max-w-sm mx-auto">
          कॉल्स attend करके घर बैठे कमाई का एक नया तरीका — जल्द ही NextAaroh पर।
        </p>
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 mb-6">
          ⚠️ यह feature अभी planning stage में है। <strong>Vyaktigat Vikas (VV)</strong> के साथ partnership की official approval अभी नहीं मिली है — यहां दी गई जानकारी सिर्फ आने वाले program की झलक है, अभी इसे join नहीं किया जा सकता।
        </div>

        <section className="mb-8">
          <h2 className="text-base font-bold mb-1">यह क्या है?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Call & Earn एक ऐसा program होगा जहां NextAaroh के users verified calls/tasks attend करके
            extra income कमा सकेंगे — बिना अपनी पढ़ाई या मुख्य काम को छोड़े, अपनी सुविधा के समय पर।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold mb-3">यह कैसे काम करेगा</h2>
          <div className="space-y-3">
            {HOW_IT_WORKS.map((item) => {
              return (
                <div key={item.step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold mb-3">फायदे</h2>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map((benefit) => {
              return (
                <div key={benefit.title} className="border border-gray-200 rounded-xl p-3">
                  <p className="text-xl mb-1">{benefit.emoji}</p>
                  <p className="text-xs font-semibold">{benefit.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          disabled
          className="w-full bg-gray-200 text-gray-500 font-semibold py-3 rounded-lg mb-8 cursor-not-allowed"
        >
          Explore (जल्द उपलब्ध होगा)
        </button>

        <section>
          <h2 className="text-base font-bold mb-3">अक्सर पूछे जाने वाले सवाल</h2>
          <CallEarnFaq />
        </section>
      </div>
    </div>
  );
}
