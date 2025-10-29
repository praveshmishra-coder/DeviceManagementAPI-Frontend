import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import assetApi from "../api/assetApi";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idQuery, setIdQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch all assets
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await assetApi.getAll();
      const list = res.data || [];
      // normalize backend casing
      const normalizedList = list.map((a) => ({
        assetId: a.assetId ?? a.AssetId,
        deviceId: a.deviceId ?? a.DeviceId,
        assetName: a.assetName ?? a.AssetName,
      }));
      setAssets(normalizedList);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setAssets([]);
      setError(
        err.response?.data?.title ||
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch assets"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch single asset by ID
  const fetchAssetById = useCallback(async (id) => {
    if (!id) {
      alert("Please enter an Asset ID");
      return;
    }
    setLoading(true);
    setError(null);
    setRawResponse(null);
    try {
      const res = await assetApi.getById(id);
      // Store the raw response
      setRawResponse(res.data);
      
      // Also update the table view
      const data = res.data || {};
      const normalized = {
        assetId: data.assetId ?? data.AssetId,
        deviceId: data.deviceId ?? data.DeviceId,
        assetName: data.assetName ?? data.AssetName,
      };
      setAssets([normalized]);
    } catch (err) {
      console.error("Error fetching asset by id:", err);
      setAssets([]);
      setRawResponse(err.response?.data || { error: err.message });
      setError(
        err.response?.data?.title ||
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch asset"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Delete asset
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this asset? This action cannot be undone.");
    if (!confirm) return;
    try {
      setDeletingId(id);
      await assetApi.delete(id);
      setAssets((prev) => prev.filter((a) => a.assetId !== id));
    } catch (err) {
      console.error("Failed to delete asset", err);
      alert("Failed to delete asset. See console for details.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Assets</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/assets/new")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-white text-sm hover:opacity-95"
          >
            + Add Asset
          </button>
        </div>
      </div>

      {/* Search / Fetch Section */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <input
            value={idQuery}
            onChange={(e) => setIdQuery(e.target.value)}
            placeholder="Enter Asset ID and click Fetch"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAssetById(idQuery)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white text-sm hover:opacity-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Fetch
            </button>
            <button
              onClick={() => {
                fetchAssets();
                setRawResponse(null);
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

      {/* Backend Response Display */}
      {rawResponse && (
        <div className="mb-4 overflow-x-auto bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">Backend Response:</div>
            <button 
              onClick={() => setRawResponse(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Hide
            </button>
          </div>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl p-4 card-shadow">
        {loading ? (
          <div className="py-6 text-center text-sm text-gray-600">Loading assets...</div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-red-600">
            <div>Failed to load assets: {error}</div>
            <div className="mt-2">
              <button
                className="rounded px-3 py-1 bg-primary text-white"
                onClick={() => fetchAssetById(idQuery)}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="px-4 py-3">Asset ID</th>
                <th className="px-4 py-3">Device ID</th>
                <th className="px-4 py-3">Asset Name</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.length > 0 ? (
                assets.map((a, idx) => (
                  <tr
                    key={a.assetId}
                    className={`hover:bg-gray-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{a.assetId}</td>
                    <td className="px-4 py-3">{a.deviceId}</td>
                    <td className="px-4 py-3 text-gray-600">{a.assetName}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/assets/${a.assetId}`)}
                          className="text-sm px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.assetId)}
                          disabled={deletingId === a.assetId}
                          className="text-sm px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
                        >
                          {deletingId === a.assetId ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No assets found — enter an ID and click Fetch
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

export default AssetList;
