export default function AboutPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">About NextAaroh</h1>
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        NextAaroh एक youth-first development platform है जो skill-building, leadership,
        sports और entrepreneurship के ज़रिए हर background के युवाओं को उनकी असली क्षमता
        तक पहुंचने में मदद करता है।
      </p>

      <div className="border-t pt-4 mt-4">
        <h2 className="font-semibold text-base mb-2">हमारा Vision</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          भारत का सबसे भरोसेमंद youth development platform बनना — जहां हर युवा को
          skills, guidance और असली career opportunities मिल सकें।
        </p>
      </div>

      <div className="border-t pt-4 mt-4">
        <p className="text-sm text-gray-500">Founder & CEO</p>
        <p className="font-semibold text-lg">Shailesh Kumar Chauhan</p>
      </div>
    </div>
  );
}
