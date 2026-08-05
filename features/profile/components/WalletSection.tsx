"use client";
import { useEffect, useState } from "react";

type WalletData = {
  points_balance: number;
  wallet_balance_paise: number;
};

const POINTS_PER_CONVERSION = 100;
const RUPEES_PER_CONVERSION = 5;

export default function WalletSection() {
  const [wallet, setWallet] = useState<WalletData>({ points_balance: 0, wallet_balance_paise: 0 });
  const [showConvert, setShowConvert] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [convertPoints, setConvertPoints] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("upi");
  const [withdrawDestination, setWithdrawDestination] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setWallet({
            points_balance: data.points_balance ?? 0,
            wallet_balance_paise: data.wallet_balance_paise ?? 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  const walletRupees = (wallet.wallet_balance_paise / 100).toFixed(2);
  const convertRupees = convertPoints
    ? ((Number(convertPoints) / POINTS_PER_CONVERSION) * RUPEES_PER_CONVERSION).toFixed(2)
    : "0.00";

  async function handleConvert() {
    setMessage("");
    const pointsNum = Number(convertPoints);
    if (!pointsNum || pointsNum < POINTS_PER_CONVERSION || pointsNum % POINTS_PER_CONVERSION !== 0) {
      setMessage("Points " + POINTS_PER_CONVERSION + " के multiple में डालें (जैसे 100, 200, 300)");
      return;
    }
    if (pointsNum > wallet.points_balance) {
      setMessage("इतने points आपके पास नहीं हैं");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/points/convert-to-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: pointsNum }),
      });
      if (res.ok) {
        setMessage("Convert हो गया!");
        setConvertPoints("");
      } else {
        setMessage("कुछ गलत हो गया, फिर कोशिश करें");
      }
    } catch {
      setMessage("Network error — इंटरनेट चेक करें");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWithdraw() {
    setMessage("");
    if (!withdrawAmount || !withdrawDestination) {
      setMessage("Amount और account/UPI details भरना ज़रूरी है");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/marketplace/seller/payout-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_paise: Math.round(Number(withdrawAmount) * 100),
          method: withdrawMethod,
          destination: withdrawDestination,
        }),
      });
      if (res.ok) {
        setMessage("Withdrawal request भेज दी गई — Admin approve करेंगे");
        setWithdrawAmount("");
        setWithdrawDestination("");
      } else {
        setMessage("कुछ गलत हो गया, फिर कोशिश करें");
      }
    } catch {
      setMessage("Network error — इंटरनेट चेक करें");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-br from-[#0a1a3a] to-[#132a5c] text-white p-4">
        <p className="text-xs text-white/60 mb-3">My Wallet</p>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-orange-400">{wallet.points_balance}</p>
            <p className="text-xs text-white/60">Points</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-green-400">₹{walletRupees}</p>
            <p className="text-xs text-white/60">Real Money</p>
          </div>
        </div>
      </div>

      <div className="flex divide-x divide-gray-200 border-b border-gray-200">
        <button
          type="button"
          onClick={() => {
            setShowConvert(!showConvert);
            setShowWithdraw(false);
            setMessage("");
          }}
          className="flex-1 py-3 text-sm font-medium text-orange-600"
        >
          🔄 Convert Points
        </button>
        <button
          type="button"
          onClick={() => {
            setShowWithdraw(!showWithdraw);
            setShowConvert(false);
            setMessage("");
          }}
          className="flex-1 py-3 text-sm font-medium text-blue-700"
        >
          💸 Withdraw
        </button>
      </div>

      {showConvert ? (
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-500">
            {POINTS_PER_CONVERSION} Points = ₹{RUPEES_PER_CONVERSION} — सिर्फ {POINTS_PER_CONVERSION} के multiple में convert कर सकते हैं
          </p>
          <input
            className="input"
            type="number"
            placeholder="कितने points convert करने हैं"
            value={convertPoints}
            onChange={(e) => setConvertPoints(e.target.value)}
          />
          {convertPoints ? <p className="text-sm text-green-600">मिलेंगे: ₹{convertRupees}</p> : null}
          <button
            type="button"
            onClick={handleConvert}
            disabled={submitting}
            className="w-full bg-orange-500 text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50"
          >
            {submitting ? "Converting..." : "Convert"}
          </button>
        </div>
      ) : null}

      {showWithdraw ? (
        <div className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Amount (₹)</label>
            <input className="input" type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Method</label>
            <select className="input" value={withdrawMethod} onChange={(e) => setWithdrawMethod(e.target.value)}>
              <option value="upi">UPI</option>
              <option value="bank_account">Bank Account</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              {withdrawMethod === "upi" ? "आपका UPI ID" : "आपका Bank Account Number"}
            </label>
            <input className="input" value={withdrawDestination} onChange={(e) => setWithdrawDestination(e.target.value)} />
          </div>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={submitting}
            className="w-full bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Request Withdrawal"}
          </button>
        </div>
      ) : null}

      {message ? <p className="text-xs text-orange-600 px-4 pb-3">{message}</p> : null}
    </div>
  );
}