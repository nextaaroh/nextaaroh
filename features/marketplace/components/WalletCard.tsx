"use client";
import { useEffect, useState } from "react";

type WalletData = {
  tracked_paise?: number;
  pending_paise?: number;
  balance_paise: number;
};

export default function WalletCard() {
  const [wallet, setWallet] = useState<WalletData>({ balance_paise: 0, tracked_paise: 0, pending_paise: 0 });
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [destination, setDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/v1/me/wallet-summary")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setWallet(data);
      })
      .catch(() => {});
  }, []);

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!amount || !destination) {
      setMessage("Amount और account/UPI details भरना ज़रूरी है");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/marketplace/seller/payout-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_paise: Math.round(Number(amount) * 100),
          method,
          destination,
        }),
      });
      if (res.ok) {
        setMessage("Withdrawal request भेज दी गई — Admin approve करेंगे");
        setAmount("");
        setDestination("");
      } else {
        setMessage("कुछ गलत हो गया, फिर कोशिश करें");
      }
    } catch {
      setMessage("Network error — इंटरनेट चेक करें");
    } finally {
      setSubmitting(false);
    }
  }

  const balanceRupees = ((wallet.tracked_paise ?? wallet.balance_paise) / 100).toFixed(0);
  const pendingRupees = ((wallet.pending_paise ?? 0) / 100).toFixed(0);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-gradient-to-br from-[#0a1a3a] to-[#132a5c] text-white rounded-xl p-5 text-center mb-4">
        <p className="text-xs text-white/60 mb-1">Wallet Balance</p>
        <p className="text-3xl font-bold">₹{balanceRupees}</p>
        {Number(pendingRupees) > 0 ? <p className="text-xs text-yellow-300 mt-1">+ ₹{pendingRupees} Pending</p> : null}
      </div>

      <h2 className="text-sm font-semibold mb-2">Withdraw</h2>
      <form onSubmit={handleWithdraw} className="space-y-3">
        <div>
          <label className="text-sm font-medium block mb-1">Amount (₹)</label>
          <input className="input" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Withdraw Method</label>
          <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="upi">UPI</option>
            <option value="bank_account">Bank Account</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            {method === "upi" ? "अपना UPI ID" : "अपना Bank Account Number"}
          </label>
          <input className="input" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder={method === "upi" ? "yourname@upi" : "Account number"} />
        </div>

        {message && <p className="text-sm text-orange-600">{message}</p>}

        <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
          {submitting ? "Sending..." : "Request Withdrawal"}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-3">
        यह details सिर्फ आपकी अपनी withdrawal के लिए हैं — किसी buyer के साथ share ना करें।
      </p>
    </div>
  );
}