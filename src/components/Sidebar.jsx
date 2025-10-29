import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import deviceApi from '../api/deviceApi';
import assetApi from '../api/assetApi';
import signalApi from '../api/signalApi';

const Sidebar = () => {
  const [counts, setCounts] = useState({ devices: 0, assets: 0, signals: 0 });

  useEffect(() => {
    let mounted = true;
    Promise.all([deviceApi.getAll(), assetApi.getAll(), signalApi.getAll()])
      .then(([d, a, s]) => {
        if (!mounted) return;
        setCounts({ devices: d.data?.length ?? 0, assets: a.data?.length ?? 0, signals: s.data?.length ?? 0 });
      })
      .catch((err) => {
        // Non-blocking: if counts fail, just leave them at 0 and log.
        console.error('Failed to load sidebar counts', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <aside className="w-64 bg-white h-full border-r flex flex-col">
      {/* Logo section */}
      <div className="px-6 py-8 border-b text-center">
        <h2 className="text-2xl font-bold text-gray-900">Device<span className="text-primary">Hub</span></h2>
        <p className="text-xs text-gray-500 mt-1">Device Management System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-3">
        {/* Dashboard */}
        <NavLink to="/" className={({ isActive }) =>
          `flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`
        }>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </div>
        </NavLink>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-4" />

        {/* Main navigation */}
        <NavLink to="/devices" className={({ isActive }) =>
          `flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`
        }>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v6H3a1 1 0 01-1-1v-4zM7 7a1 1 0 011-1h2a1 1 0 011 1v10H8a1 1 0 01-1-1V7zM12 3a1 1 0 011-1h2a1 1 0 011 1v14h-4V3z"/>
            </svg>
            Devices
          </div>
          <span 
            title={`${counts.devices} Devices`}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            {counts.devices}
          </span>
        </NavLink>

        <NavLink to="/assets" className={({ isActive }) =>
          `flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`
        }>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zM3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 11a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
            </svg>
            Assets
          </div>
          <span 
            title={`${counts.assets} Assets`}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700"
          >
            {counts.assets}
          </span>
        </NavLink>

        <NavLink to="/signals" className={({ isActive }) =>
          `flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`
        }>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 2a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1h-2a1 1 0 01-1-1V2z"/>
            </svg>
            Signals
          </div>
          <span 
            title={`${counts.signals} Signals`}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700"
          >
            {counts.signals}
          </span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
