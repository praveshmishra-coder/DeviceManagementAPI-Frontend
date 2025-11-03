import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import signalApi from "../api/signalApi";

const SignalList = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idQuery, setIdQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch all signals
  const fetchSignals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await signalApi.getAll();
      const list = res.data || [];
      // normalize casing
      const normalizedList = list.map((s) => ({
        signalId: s.signalId ?? s.SignalId,
        signalTag: s.signalTag ?? s.SignalTag,
        registerAddress: s.registerAddress ?? s.RegisterAddress,
        assetId: s.assetId ?? s.AssetId,
      }));
      setSignals(normalizedList);
    } catch (err) {
      console.error("Error fetching signals:", err);
      setSignals([]);
      setError(err.message || "Failed to fetch signals");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch signal by ID
  const fetchSignalById = useCallback(async (id) => {
    if (!id) {
      alert("Please enter a Signal ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await signalApi.getById(id);
      // Also update the table view
      const data = res.data || {};
      const normalized = {
        signalId: data.signalId ?? data.SignalId,
        signalTag: data.signalTag ?? data.SignalTag,
        registerAddress: data.registerAddress ?? data.RegisterAddress,
        assetId: data.assetId ?? data.AssetId,
      };
      setSignals([normalized]);
    } catch (err) {
      console.error("Error fetching signal by id:", err);
      setSignals([]);
      setError(err.message || "Failed to fetch signal");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Delete signal
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this signal? This action cannot be undone.");
    if (!confirm) return;
    try {
      setDeletingId(id);
      await signalApi.delete(id);
      setSignals((prev) => prev.filter((s) => s.signalId !== id));
    } catch (err) {
      console.error("Failed to delete signal", err);
      alert("Failed to delete signal. See console for details.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Signals</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/signals/new")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-white text-sm hover:opacity-95"
          >
            + Add Signal
          </button>
        </div>
      </div>

      {/* Search / Fetch Section */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <input
            value={idQuery}
            onChange={(e) => setIdQuery(e.target.value)}
            placeholder="Enter Signal ID and click Fetch"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchSignalById(idQuery)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white text-sm hover:opacity-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Fetch
            </button>
            <button
              onClick={() => {
                  fetchSignals();
                  setIdQuery("");
                }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white text-sm hover:opacity-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* Backend raw response display removed to avoid leaking backend internals in UI */}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl p-4 card-shadow">
        {loading ? (
          <div className="py-6 text-center text-sm text-gray-600">Loading signals...</div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-red-600">
            <div>Failed to load signals: {error}</div>
            <div className="mt-2">
              <button
                className="rounded px-3 py-1 bg-primary text-white"
                onClick={() => fetchSignalById(idQuery)}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="px-4 py-3">Signal ID</th>
                <th className="px-4 py-3">Signal Tag</th>
                <th className="px-4 py-3">Register Address</th>
                <th className="px-4 py-3">Asset ID</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {signals.length > 0 ? (
                signals.map((s, idx) => (
                  <tr
                    key={s.signalId}
                    className={`hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-4 py-3">{s.signalId}</td>
                    <td className="px-4 py-3 text-gray-700">{s.signalTag}</td>
                    <td className="px-4 py-3 text-gray-600">{s.registerAddress}</td>
                    <td className="px-4 py-3">{s.assetId}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/signals/${s.signalId}`)}
                          className="text-sm px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.signalId)}
                          disabled={deletingId === s.signalId}
                          className="text-sm px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
                        >
                          {deletingId === s.signalId ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No signals found — enter an ID and click Fetch
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SignalList;
