import { useState } from "react";

type PincodeResult = { state: string; district: string } | null;

export function usePincodeLookup() {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function lookup(pin: string): Promise<PincodeResult> {
    setNotFound(false);
    if (!/^\d{6}$/.test(pin)) return null;
    setLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const postOffice = data?.[0]?.PostOffice?.[0];
      if (data?.[0]?.Status === "Success" && postOffice) {
        return { state: postOffice.State, district: postOffice.District };
      }
      setNotFound(true);
      return null;
    } catch {
      setNotFound(true);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { lookup, loading, notFound };
}