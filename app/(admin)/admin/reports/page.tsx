"use client";
import { useEffect, useState, useCallback } from "react";

type Report = {
  id: string;
  content_type: string;
  content_id: string;
  reason: string;
  free_text: string | null;
  created_at: string;
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/v1/admin/reports")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setReports(data?.data ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleResolve(id: string) {
    await fetch("/api/v1/admin/reports/" + id + "/resolve", { method: "POST" });
    load();
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Reports</h1>
      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}
      {!loading && reports.length === 0 ? <p className="text-gray-400 text-sm">कोई open report नहीं है 🎉</p> : null}
      <div className="space-y-3">
        {reports.map((report) => {
          return (
            <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium capitalize">{report.content_type.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-400 capitalize">{report.reason.replace(/_/g, " ")}</p>
                  {report.free_text ? <p className="text-sm text-gray-600 mt-1">{report.free_text}</p> : null}
                </div>
                <button type="button" onClick={() => handleResolve(report.id)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg shrink-0">
                  Resolve
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
