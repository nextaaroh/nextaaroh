"use client";
import { useEffect, useState, useCallback } from "react";

type User = {
  id: string;
  username: string;
  full_name: string;
  mobile_number: string;
  role: string;
  status: string;
  class_segment: string;
  state: string;
  district: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const query = search ? "?search=" + encodeURIComponent(search) : "";
    fetch("/api/v1/admin/users" + query)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setUsers(data?.data ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSuspend(id: string) {
    await fetch("/api/v1/admin/users/" + id + "/suspend", { method: "POST" });
    load();
  }

  async function handleDelete(id: string) {
    await fetch("/api/v1/admin/users/" + id + "/delete", { method: "POST" });
    setConfirmingDeleteId(null);
    load();
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Users</h1>

      <input
        className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4"
        placeholder="Username या नाम से खोजें..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? <p className="text-gray-400 text-sm">Loading...</p> : null}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Username</th>
              <th className="text-left px-3 py-2">Role</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Location</th>
              <th className="text-left px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{user.full_name}</td>
                  <td className="px-3 py-2">@{user.username}</td>
                  <td className="px-3 py-2 capitalize">{user.role}</td>
                  <td className="px-3 py-2">
                    <span className={user.status === "active" ? "text-green-600" : "text-red-600"}>{user.status}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-400">{user.district}, {user.state}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {user.status === "active" ? (
                        <button type="button" onClick={() => handleSuspend(user.id)} className="text-xs text-yellow-600">
                          Suspend
                        </button>
                      ) : null}
                      {confirmingDeleteId === user.id ? (
                        <>
                          <button type="button" onClick={() => handleDelete(user.id)} className="text-xs text-red-600 font-semibold">
                            Confirm Delete
                          </button>
                          <button type="button" onClick={() => setConfirmingDeleteId(null)} className="text-xs text-gray-400">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setConfirmingDeleteId(user.id)} className="text-xs text-red-600">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
