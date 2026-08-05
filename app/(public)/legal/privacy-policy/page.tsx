export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Privacy Policy</h1>
      <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
        <p>
          NextAaroh आपकी privacy का सम्मान करता है। यह policy बताती है कि हम आपकी जानकारी कैसे collect,
          इस्तेमाल और सुरक्षित रखते हैं।
        </p>
        <p>
          <strong>हम क्या collect करते हैं:</strong> नाम, mobile number, location (State/District/PIN),
          class/segment, और आप platform पर जो activity करते हैं (points, quiz, marketplace, community posts)।
        </p>
        <p>
          <strong>इस्तेमाल कैसे होता है:</strong> आपका experience personalize करने, points/rewards देने,
          और platform को सुरक्षित रखने के लिए। हम आपकी जानकारी किसी third-party को बेचते नहीं हैं।
        </p>
        <p>
          <strong>Payments:</strong> सारी payments सिर्फ NextAaroh Payment Gateway से process होती हैं —
          कभी भी buyer/seller के बीच direct UPI या bank details share नहीं होने देते।
        </p>
        <p>
          <strong>Minors:</strong> जो users class 5-12 में हैं, उनके लिए guardian consent ज़रूरी है और
          उनकी profile की जानकारी सीमित रूप से ही public रहती है।
        </p>
        <p className="text-gray-400 text-xs">यह एक draft policy है, project के आगे बढ़ने के साथ अपडेट होती रहेगी।</p>
      </div>
    </div>
  );
}
