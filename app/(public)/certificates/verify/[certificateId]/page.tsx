"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Certificate = {
  first_name_masked: string;
  title: string;
  issued_at: string;
};

export default function VerifyCertificatePage() {
  const params = useParams<{ certificateId: string }>();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/certificates/verify/" + params.certificateId)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setCert(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.certificateId]);

  return (
    <div className="max-w-md mx-auto p-4 pt-10 text-center">
      {loading ? <p className="text-gray-400 text-sm">Verifying...</p> : null}

      {!loading && notFound ? (
        <>
          <p className="text-5xl mb-3">❌</p>
          <h1 className="text-lg font-bold mb-2">Certificate Not Found</h1>
          <p className="text-sm text-gray-500">यह certificate ID valid नहीं है, कृपया दोबारा जांचें।</p>
        </>
      ) : null}

      {!loading && cert ? (
        <>
          <p className="text-5xl mb-3">✅</p>
          <h1 className="text-lg font-bold mb-1">Certificate Verified</h1>
          <div className="border border-gray-200 rounded-xl p-5 mt-4 text-left">
            <p className="text-xs text-gray-400">Awarded to</p>
            <p className="font-semibold text-base mb-3">{cert.first_name_masked}</p>
            <p className="text-xs text-gray-400">For</p>
            <p className="font-semibold text-base mb-3">{cert.title}</p>
            <p className="text-xs text-gray-400">Issued on</p>
            <p className="font-semibold text-base">{cert.issued_at}</p>
          </div>
          <p className="text-xs text-gray-400 mt-4">Issued by NextAaroh</p>
        </>
      ) : null}
    </div>
  );
}