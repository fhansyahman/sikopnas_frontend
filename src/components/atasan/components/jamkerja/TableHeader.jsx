"use client";

import { Clock, Calendar, AlertCircle, Activity, Settings } from "lucide-react";

export function TableHeader() {
  const headers = [
    { icon: <Clock size={14} className="text-gray-500" />, label: "Setting Jam Kerja" },
    { icon: <Calendar size={14} className="text-gray-500" />, label: "Waktu Kerja" },
    { icon: <AlertCircle size={14} className="text-gray-500" />, label: "Toleransi & Batas" },
    { icon: <Activity size={14} className="text-gray-500" />, label: "Status" },
    { icon: <Settings size={14} className="text-gray-500" />, label: "Aksi" }
  ];

  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        {headers.map((header, index) => (
          <th key={index} className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              {header.icon}
              <span>{header.label}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}