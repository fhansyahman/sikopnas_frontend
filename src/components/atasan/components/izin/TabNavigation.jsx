"use client";

import { Database, TrendingUp } from "lucide-react";

export function TabNavigation({ activeTab, onTabChange, totalData }) {
  const tabs = [
    {
      id: 'data',
      label: 'Data Izin',
      icon: <Database size={16} />,
      badge: totalData
    },
    {
      id: 'statistik',
      label: 'Statistik',
      icon: <TrendingUp size={16} />
    }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 ${
            activeTab === tab.id 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}