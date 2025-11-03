import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeviceList from "./components/DeviceList";
import AddDeviceForm from "./components/AddDeviceForm";
import EditDeviceForm from "./components/EditDeviceForm";
import AssetList from "./components/AssetList";
import SignalList from "./components/SignalList";
import AddSignalForm from "./components/AddSignalForm";
import EditSignalForm from "./components/EditSignalForm";
import Sidebar from "./components/Sidebar";
import SummaryCard from "./components/SummaryCard";
import AddAssetForm from "./components/AddAssetForm";
import EditAssetForm from "./components/EditAssetForm";
import deviceApi from "./api/deviceApi";
import assetApi from "./api/assetApi";
import signalApi from "./api/signalApi";
import AppHeader from "./components/AppHeader";
import InteractiveIndustry from "./components/InteractiveIndustry";
import DataFlowDiagram from "./components/DataFlowDiagram";

// ---------------- Dashboard Component ----------------
const Dashboard = () => {
  const [totals, setTotals] = useState({
    devices: null,
    assets: null,
    signals: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([deviceApi.getAll(), assetApi.getAll(), signalApi.getAll()])
      .then(([dRes, aRes, sRes]) => {
        if (!mounted) return;
        const devices = Array.isArray(dRes.data)
          ? dRes.data.length
          : dRes.data?.length ?? 0;
        const assets = Array.isArray(aRes.data)
          ? aRes.data.length
          : aRes.data?.length ?? 0;
        const signals = Array.isArray(sRes.data)
          ? sRes.data.length
          : sRes.data?.length ?? 0;
        setTotals({ devices, assets, signals });
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading totals", err);
        if (!mounted) return;
        setError("Failed to load totals");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // SVG Icons
  const DeviceIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-violet-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2h-2.5a2 2 0 00-1.788 1.106L12 9l-1.712-2.894A2 2 0 008.5 5H6a2 2 0 00-2 2v3a2 2 0 002 2h2"
      />
    </svg>
  );

  const AssetIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-amber-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
    </svg>
  );

  const SignalIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-teal-500"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M2 8a1 1 0 011-1h14a1 1 0 011 1v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
    </svg>
  );

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-gray-500">
            Summary of Devices, Assets and Signals
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Devices"
          value={loading ? "—" : totals.devices ?? 0}
          icon={DeviceIcon}
          color="bg-gradient-to-br from-white to-violet-50"
        />
        <SummaryCard
          title="Total Assets"
          value={loading ? "—" : totals.assets ?? 0}
          icon={AssetIcon}
          color="bg-gradient-to-br from-white to-amber-50"
        />
        <SummaryCard
          title="Total Signals"
          value={loading ? "—" : totals.signals ?? 0}
          icon={SignalIcon}
          color="bg-gradient-to-br from-white to-teal-50"
        />
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error} — check your API server or console for details.
        </div>
      )}

      <section className="mt-6">
        <div className="mt-4 bg-white rounded-2xl p-6 card-shadow">
          <InteractiveIndustry />
        </div>
      </section>
    </div>
  );
};

// ---------------- App Layout ----------------
const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1">
          <AppHeader />

          <div className="max-w-7xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/devices" element={<DeviceList />} />
              <Route path="/devices/new" element={<AddDeviceForm />} />
              <Route path="/devices/:id" element={<EditDeviceForm />} />
              <Route path="/assets" element={<AssetList />} />
              <Route path="/assets/new" element={<AddAssetForm />} />
              <Route path="/assets/:id" element={<EditAssetForm />} />
              <Route path="/signals" element={<SignalList />} />
              <Route path="/signals/new" element={<AddSignalForm />} />
              <Route path="/signals/:id" element={<EditSignalForm />} />
              <Route path="/architecture" element={<DataFlowDiagram />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
