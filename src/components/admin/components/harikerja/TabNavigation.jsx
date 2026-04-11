"use client";

import { CalendarDays, Workflow, PartyPopper } from "lucide-react";

export function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'kalender', label: 'Kalender', icon: <CalendarDays size={18} />, color: 'blue' },
    { id: 'hari-libur', label: 'Hari Libur', icon: <PartyPopper size={18} />, color: 'purple' },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === tab.id 
              ? `border-${tab.color}-600 text-${tab.color}-600` 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}