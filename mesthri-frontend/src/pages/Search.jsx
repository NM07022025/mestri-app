import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8082";

function getAuthHeader() {
  const token = localStorage.getItem("mesthri_basic");
  return token ? { Authorization: token } : {};
}
function isLoggedIn() {
  return !!localStorage.getItem("mesthri_basic");
}

export default function Search() {
  const nav = useNavigate();
  const [role, setRole] = useState("MESTRI");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) nav("/customer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchResults() {
    if (!isLoggedIn()) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ role });
      if (service.trim()) params.set("service", service.trim());
      if (location.trim()) params.set("location", location.trim());
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const res = await fetch(`${BASE_URL}/api/directory?${params.toString()}`, {
        headers: { Accept: "application/json", ...getAuthHeader() },
      });

      const text = await res.text();
      let data = [];
      if (text && text.trim().length > 0) {
        data = JSON.parse(text);
      }

      if (!res.ok) {
        const msg =
          (data && typeof data === "object" && data.message) ||
          res.statusText ||
          "Request failed";
        throw new Error(msg);
      }

      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn()) fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
      <Navbar />

      <div className="p-6 mx-auto max-w-6xl">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700">Search Directory</h1>
          <p className="text-slate-600 mt-1">
            Find <span className="font-semibold">{role === "MESTRI" ? "Mestris" : "Workers"}</span>{" "}
            by role, service, location, and availability.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="MESTRI">Mestri</option>
                <option value="WORKER">Worker</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Service / Skill</label>
              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. masonry, plumbing"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchResults}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-2.5 px-4 rounded-lg shadow transition"
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 font-semibold">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {!loading && !error && results.length === 0 && (
            <div className="bg-white rounded-xl p-5 shadow text-slate-600">
              No results yet. Try adjusting filters.
            </div>
          )}

          {results.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl shadow-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {u.name || "(No name provided)"}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      (u.role || "").toUpperCase() === "WORKER"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>

                <div className="mt-2 text-slate-700 space-x-3 text-sm">
                  {u.location && <span>📍 {u.location}</span>}
                  {u.phone && <span>📞 {u.phone}</span>}
                  {(u.availabilityStartDate || u.availabilityEndDate) && (
                    <span>
                      🗓️ {u.availabilityStartDate || "—"} → {u.availabilityEndDate || "—"}
                    </span>
                  )}
                </div>

                {Array.isArray(u.skills) && u.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {u.skills.map((s, i) => (
                      <span
                        key={`${u.id}-skill-${i}`}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {u.phone && (
                  <a
                    href={`tel:${u.phone}`}
                    className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
                  >
                    Call
                  </a>
                )}
                <button
                  className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg shadow transition"
                  onClick={() => alert("Booking flow coming soon!")}
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}
