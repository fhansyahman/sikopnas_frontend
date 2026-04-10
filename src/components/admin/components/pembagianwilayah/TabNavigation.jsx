"use client";

import { MapPin, UserCheck, TrendingUp } from "lucide-react";

export function TabNavigation({ activeTab, setActiveTab, children }) {
  const tabs = [
    { id: 'wilayah', label: 'Data Wilayah', icon: <MapPin size={16} /> },
    { id: 'assignment', label: 'Penugasan Wilayah', icon: <UserCheck size={16} /> },
    { id: 'stats', label: 'Statistik', icon: <TrendingUp size={16} /> }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}