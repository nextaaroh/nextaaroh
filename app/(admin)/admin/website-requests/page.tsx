"use client";

import { useEffect, useState } from "react";

type RequestItem = {
  id: string;
  full_name: string;
  business_name: string;
  whatsapp_number: string;
  email: string | null;
  business_category: string;
  package: string;
  required_pages: string | null;
  business_description: string | null;
  services_products: string | null;
  business_address: string | null;
  google_maps_location: string | null;
  social_link: string | null;
  website_whatsapp_number: string | null;
  has_logo: string | null;
  has_photos: string | null;
  additional_requirements: string | null;
  preferred_contact_method: string | null;
  status: string;
  created_at: string;
};

const statuses = [
  "new",
  "contacted",
  "confirmed",
  "in_progress",
  "delivered",
];

function statusLabel(status: string) {
  return status.replace("_", " ").toUpperCase();
}

function statusClass(status: string) {
  if (status === "new") return "bg-blue-100 text-blue-700";
  if (status === "contacted") return "bg-yellow-100 text-yellow-700";
  if (status === "confirmed") return "bg-purple-100 text-purple-700";
  if (status === "in_progress") return "bg-orange-100 text-orange-700";
  if (status === "delivered") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
}

export default function WebsiteRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RequestItem | null>(null);
  const [updating, setUpdating] = useState(false);

  async function loadRequests() {
    setLoading(true);

    try {
      const res = await fetch("/api/v1/admin/website-requests", {
        cache: "no-store",
      });

      const json = await res.json();

      if (res.ok) {
        setRequests(json.data ?? []);
      }
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(true);

    try {
      const res = await fetch("/api/v1/admin/website-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        alert("Status update nahi hua");
        return;
      }

      setRequests((old) =>
        old.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );

      setSelected((old) =>
        old?.id === id ? { ...old, status } : old
      );
    } catch {
      alert("Something went wrong");
    } finally {
      setUpdating(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Website Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Business website service requests manage karein
            </p>
          </div>

          <button
            type="button"
            onClick={loadRequests}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Stat title="Total" value={requests.length} />
          <Stat
            title="New"
            value={requests.filter((r) => r.status === "new").length}
          />
          <Stat
            title="Contacted"
            value={requests.filter((r) => r.status === "contacted").length}
          />
          <Stat
            title="In Progress"
            value={requests.filter((r) => r.status === "in_progress").length}
          />
          <Stat
            title="Delivered"
            value={requests.filter((r) => r.status === "delivered").length}
          />
        </div>

        {loading ? (
          <div className="bg-white border rounded-xl p-10 text-center text-sm text-gray-500">
            Loading website requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center">
            <div className="text-4xl mb-3">🌐</div>
            <h2 className="font-bold text-gray-800">
              No Website Requests
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              New website service requests yahan दिखाई देंगे।
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-gray-900">
                        {item.business_name}
                      </h2>

                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusClass(
                          item.status
                        )}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {item.full_name} · {item.business_category}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      📦 {item.package} · 📱 {item.whatsapp_number}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(item.created_at)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${item.whatsapp_number.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                    >
                      WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="bg-[#0a1a3a] text-white px-4 py-2 rounded-lg text-xs font-semibold"
                    >
                      View Details
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full md:max-w-2xl md:rounded-2xl max-h-[92vh] overflow-y-auto">

              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">
                    {selected.business_name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Website Request
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>
              </div>

              <div className="p-4 space-y-4">

                <Detail label="Full Name" value={selected.full_name} />
                <Detail label="Business Name" value={selected.business_name} />
                <Detail label="WhatsApp" value={selected.whatsapp_number} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Business Category" value={selected.business_category} />
                <Detail label="Package" value={selected.package} />
                <Detail label="Required Pages" value={selected.required_pages} />
                <Detail label="Business Description" value={selected.business_description} />
                <Detail label="Services / Products" value={selected.services_products} />
                <Detail label="Business Address" value={selected.business_address} />
                <Detail label="Google Maps" value={selected.google_maps_location} />
                <Detail label="Social Link" value={selected.social_link} />
                <Detail label="Website WhatsApp" value={selected.website_whatsapp_number} />
                <Detail label="Has Logo" value={selected.has_logo} />
                <Detail label="Has Photos" value={selected.has_photos} />
                <Detail label="Additional Requirements" value={selected.additional_requirements} />
                <Detail label="Preferred Contact" value={selected.preferred_contact_method} />

                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Status
                  </label>

                  <select
                    value={selected.status}
                    disabled={updating}
                    onChange={(e) =>
                      updateStatus(selected.id, e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${selected.whatsapp_number.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-green-500 text-white py-3 rounded-lg text-sm font-semibold"
                  >
                    💬 WhatsApp
                  </a>

                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}`}
                      className="flex-1 text-center bg-gray-900 text-white py-3 rounded-lg text-sm font-semibold"
                    >
                      ✉️ Email
                    </a>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
        {value}
      </p>
    </div>
  );
}
