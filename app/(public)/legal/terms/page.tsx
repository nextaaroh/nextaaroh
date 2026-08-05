export default function TermsPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Terms & Conditions</h1>
      <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
        <p>NextAaroh इस्तेमाल करके आप इन शर्तों से सहमत होते हैं:</p>
        <p>
          <strong>Account:</strong> एक व्यक्ति सिर्फ एक account बना सकता है। गलत जानकारी देने पर account suspend हो सकता है।
        </p>
        <p>
          <strong>Marketplace:</strong> सिर्फ अपना बनाया हुआ original content ही sell किया जा सकता है।
          Copyrighted material, paid course material या pirated PDFs upload करना सख्त मना है।
        </p>
        <p>
          <strong>Payments:</strong> सारी payments सिर्फ NextAaroh Payment Gateway से होती हैं। Buyer-seller
          के बीच direct payment (UPI/bank transfer) allowed नहीं है।
        </p>
        <p>
          <strong>Community Conduct:</strong> Spam, harassment, hate speech, या misleading जानकारी post
          करने पर content हटाया जा सकता है और account पर action लिया जा सकता है।
        </p>
        <p>
          <strong>Points & Wallet:</strong> Points सिर्फ platform के अंदर redeem किए जा सकते हैं (Wallet में
          convert करके), यह किसी legal tender के बराबर नहीं है।
        </p>
        <p className="text-gray-400 text-xs">यह एक draft है, project के आगे बढ़ने के साथ अपडेट होती रहेगी।</p>
      </div>
    </div>
  );
}
