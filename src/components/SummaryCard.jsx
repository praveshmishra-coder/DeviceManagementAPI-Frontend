import React from 'react';

const SummaryCard = ({ title, value, icon, color = 'bg-white' }) => {
  return (
    <div className={`rounded-2xl p-5 ${color} card-shadow transition-transform hover:scale-[1.02]`}> 
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
