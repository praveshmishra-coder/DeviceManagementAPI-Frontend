import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import deviceApi from "../api/deviceApi";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idQuery, setIdQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch all devices
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await deviceApi.getAll();
      const list = res.data || [];
      // normalize backend casing
      const normalizedList = list.map((d) => ({
        deviceId: d.deviceId ?? d.DeviceId,
        deviceName: d.deviceName ?? d.DeviceName,
        deviceType: d.deviceType ?? d.DeviceType,
      }));
      setDevices(normalizedList);
    } catch (err) {
      console.error("Error fetching devices:", err);
      setDevices([]);
      setError(err.message || "Failed to fetch devices");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch single device by ID
  const fetchDeviceById = useCallback(async (id) => {
    if (!id) {
      alert("Please enter a Device ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await deviceApi.getById(id);
      const data = res.data || {};
      const normalized = {
        deviceId: data.deviceId ?? data.DeviceId,
        deviceName: data.deviceName ?? data.DeviceName,
        deviceType: data.deviceType ?? data.DeviceType,
      };
      setDevices([normalized]);
    } catch (err) {
      console.error("Error fetching device by id:", err);
      setDevices([]);
      setError(err.message || "Failed to fetch device");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Delete device
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this device? This action cannot be undone.");
    if (!confirm) return;
    try {
      setDeletingId(id);
      await deviceApi.delete(id);
      setDevices((prev) => prev.filter((d) => d.deviceId !== id));
    } catch (err) {
      console.error("Failed to delete device", err);
      alert("Failed to delete device. See console for details.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Devices</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/devices/new")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-white text-sm hover:opacity-95"
          >
            + Add Device
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-1/2">
          <input
            value={idQuery}
            onChange={(e) => setIdQuery(e.target.value)}
            placeholder="Enter device ID and click Fetch"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDeviceById(idQuery)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white text-sm hover:opacity-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Fetch Device
            </button>
            <button
              onClick={() => { fetchDevices(); setIdQuery(""); }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white text-sm hover:opacity-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Show All Devices
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl p-4 card-shadow">
        {loading ? (
          <div className="py-6 text-center text-sm text-gray-600">Loading devices...</div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-red-600">
            <div>Failed to load devices: {String(error)}</div>
            <div className="mt-2">
              <button className="rounded px-3 py-1 bg-primary text-white" onClick={fetchDevices}>
                Retry
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="px-4 py-3">Device ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {devices.length > 0 ? (
                devices.map((d, idx) => (
                  <tr
                    key={d.deviceId}
                    className={`hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-4 py-3">{d.deviceId}</td>
                    <td className="px-4 py-3">{d.deviceName}</td>
                    <td className="px-4 py-3 text-gray-600">{d.description}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/devices/${d.deviceId}`)}
                          className="text-sm px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d.deviceId)}
                          disabled={deletingId === d.deviceId}
                          className="text-sm px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
                        >
                          {deletingId === d.deviceId ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                    No devices found — enter an ID and click Fetch
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

export default DeviceList;
