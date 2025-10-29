import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import DeviceList from './components/DeviceList';
import AddDeviceForm from './components/AddDeviceForm';
import EditDeviceForm from './components/EditDeviceForm';
import AssetList from './components/AssetList';
import SignalList from './components/SignalList';
import AddSignalForm from './components/AddSignalForm';
import EditSignalForm from './components/EditSignalForm';
import Sidebar from './components/Sidebar';
import SummaryCard from './components/SummaryCard';
import AddAssetForm from './components/AddAssetForm';
import EditAssetForm from './components/EditAssetForm';
import { useEffect, useState } from 'react';
import deviceApi from './api/deviceApi';
import assetApi from './api/assetApi';
import signalApi from './api/signalApi';

const Dashboard = () => {
  // Fetch real totals from the backend using the existing API helpers.
  // We fetch lists and count items here because the backend does not expose
  // dedicated "count" endpoints in the provided API helpers.
  const [totals, setTotals] = useState({ devices: null, assets: null, signals: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([deviceApi.getAll(), assetApi.getAll(), signalApi.getAll()])
      .then(([dRes, aRes, sRes]) => {
        if (!mounted) return;
        const devices = Array.isArray(dRes.data) ? dRes.data.length : (dRes.data?.length ?? 0);
        const assets = Array.isArray(aRes.data) ? aRes.data.length : (aRes.data?.length ?? 0);
        const signals = Array.isArray(sRes.data) ? sRes.data.length : (sRes.data?.length ?? 0);
        setTotals({ devices, assets, signals });
        setError(null);
      })
      .catch((err) => {
        console.error('Error loading totals', err);
        if (!mounted) return;
        setError('Failed to load totals');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const DeviceIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-violet-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2h-2.5a2 2 0 00-1.788 1.106L12 9l-1.712-2.894A2 2 0 008.5 5H6a2 2 0 00-2 2v3a2 2 0 002 2h2" />
    </svg>
  );

  const AssetIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
    </svg>
  );

  const SignalIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 8a1 1 0 011-1h14a1 1 0 011 1v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
    </svg>
  );

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-gray-500">Summary of Devices, Assets and Signals</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Welcome back, Pravesh</div>
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">P</div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Devices"
          value={loading ? '—' : totals.devices ?? 0}
          icon={DeviceIcon}
          color="bg-gradient-to-br from-white to-violet-50"
        />
        <SummaryCard
          title="Total Assets"
          value={loading ? '—' : totals.assets ?? 0}
          icon={AssetIcon}
          color="bg-gradient-to-br from-white to-amber-50"
        />
        <SummaryCard
          title="Total Signals"
          value={loading ? '—' : totals.signals ?? 0}
          icon={SignalIcon}
          color="bg-gradient-to-br from-white to-teal-50"
        />
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">{error} — check your API server or the console for details.</div>
      )}

      <section className="mt-6">
        <div className="mt-4 bg-white rounded-2xl p-6 card-shadow">
          <InteractiveIndustry />
        </div>
      </section>
    </div>
  );
};

// Small interactive component placed in the Dashboard card
const InteractiveIndustry = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [quizAnswer, setQuizAnswer] = React.useState("");
  const [quizResult, setQuizResult] = React.useState(null);

  const handleCheck = () => {
    const correct = quizAnswer.trim().toLowerCase();
    if (!correct) return setQuizResult({ ok: false, text: 'Please enter an answer.' });
    if (correct === 'sensors' || correct === 'smart sensors') {
      setQuizResult({ ok: true, text: 'Correct — sensors are a core part of Industry 4.0.' });
    } else {
      setQuizResult({ ok: false, text: 'Not quite — try thinking about the devices that collect data (hint: sensors).' });
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">🏭 What is Industry 4.0?</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Industry 4.0 is the digital transformation of manufacturing and industrial processes combining connectivity,
            automation and data-driven systems to make factories smarter and more efficient.
          </p>
        </div>
        <div className="ml-6 flex-shrink-0">
          <button
            onClick={() => setExpanded((s) => !s)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-white text-sm hover:opacity-95"
          >
            {expanded ? 'Show less' : 'Learn more'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Smart sensors & IoT</strong> — collect data from machines and the environment.</li>
            <li><strong>Automation & Robotics</strong> — perform repetitive and precise tasks at scale.</li>
            <li><strong>AI & Machine Learning</strong> — analyze data and enable intelligent decisions.</li>
            <li><strong>Big Data & Cloud</strong> — store and process large datasets for insights.</li>
            <li><strong>Cyber-Physical Systems</strong> — integrate physical equipment with software and networking.</li>
          </ul>

          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-800">Quick check — try this</div>
            <div className="mt-2 text-sm text-gray-600">Name one core device type that collects data in Industry 4.0:</div>
            <div className="mt-3 flex items-center gap-2">
              <input
                value={quizAnswer}
                onChange={(e) => { setQuizAnswer(e.target.value); setQuizResult(null); }}
                placeholder="e.g. sensors"
                className="rounded-lg border px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button onClick={handleCheck} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700">Check</button>
              <button onClick={() => { setQuizAnswer(''); setQuizResult(null); }} className="px-3 py-2 rounded-md border text-sm">Reset</button>
            </div>
            {quizResult && (
              <div className={`mt-3 text-sm ${quizResult.ok ? 'text-emerald-700' : 'text-red-600'}`}>{quizResult.text}</div>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Want to learn more? <a className="text-primary underline" href="https://en.wikipedia.org/wiki/Industry_4.0" target="_blank" rel="noreferrer">Read the Wikipedia overview</a>.
          </div>
        </div>
      )}
    </div>
  );
};

const AppHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 bg-white/60 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="text-xl font-semibold">Device Management</div>
        </div>
        <div className="flex items-center gap-4">
          {/* <input className="hidden sm:block rounded-lg border px-3 py-1 text-sm" placeholder="Search devices, assets..." /> */}
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">P</div>
        </div>
      </div>
    </div>
  );
};

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
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
