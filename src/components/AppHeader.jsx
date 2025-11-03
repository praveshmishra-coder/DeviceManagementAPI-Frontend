import React from "react";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-white/60 backdrop-blur border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left side - menu + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            title="Go to Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          </button>

          <div className="text-xl font-semibold text-gray-800">
            Device Management <span className="text-primary">App</span>
          </div>
        </div>

        {/* Right side - optional user or search */}
        <div className="flex items-center gap-4">
          {/* Example future enhancements:
              <input className="hidden sm:block rounded-lg border px-3 py-1 text-sm" placeholder="Search..." />
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">P</div> 
          */}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
