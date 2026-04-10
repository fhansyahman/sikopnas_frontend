"use client";

import { Plus, FileText } from "lucide-react";

export function TabNavigation({ tab, onTabChange }) {
  const tabs = [
    { key: "input", label: "Input Kinerja", icon: Plus },
    { key: "tampilan", label: "Data Kinerja", icon: FileText },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="flex border-b border-slate-200">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`flex items-center justify-center space-x-2 flex-1 py-4 font-medium text-sm transition-colors ${
              tab === item.key
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
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