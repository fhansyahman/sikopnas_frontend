"use client";

import { FileSpreadsheet, BarChart3 } from "lucide-react";

export function TabNavigation({ activeTab, onTabChange, rekapCount }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <TabButton
          active={activeTab === 'rekap'}
          onClick={() => onTabChange('rekap')}
          icon={<FileSpreadsheet size={16} />}
          label={`Rekap Bulanan (${rekapCount})`}
        />
        
        <TabButton
          active={activeTab === 'statistik'}
          onClick={() => onTabChange('statistik')}
          icon={<BarChart3 size={16} />}
          label="Statistik"
        />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
        active 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
    </button>
  );
}