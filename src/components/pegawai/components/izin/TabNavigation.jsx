"use client";

import { Plus, FileText } from "lucide-react";

export function TabNavigation({ tab, onTabChange }) {
  const tabs = [
    { key: "pengajuan", label: "Pengajuan Izin", icon: Plus },
    { key: "persetujuan", label: "Data Izin", icon: FileText },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div className="flex border-b border-gray-200">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`flex items-center justify-center space-x-2 flex-1 py-4 font-medium text-sm transition-colors duration-200 ${
              tab === item.key
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}