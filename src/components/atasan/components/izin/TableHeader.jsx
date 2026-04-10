"use client";

import { Calendar, CalendarDays, MapPin, CheckSquare, Clock, Settings } from "lucide-react";

export function TableHeader({ onToggleSelectAll, isAllSelected, isIndeterminate }) {
  const columns = [
    { label: "Pegawai", icon: <Calendar size={14} className="text-gray-500" /> },
    { label: "Jenis & Periode", icon: <CalendarDays size={14} className="text-gray-500" /> },
    { label: "Wilayah", icon: <MapPin size={14} className="text-gray-500" /> },
    { label: "Status", icon: <CheckSquare size={14} className="text-gray-500" /> },
    { label: "Diajukan", icon: <Clock size={14} className="text-gray-500" /> },
    { label: "Aksi", icon: <Settings size={14} className="text-gray-500" /> }
  ];

  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={input => {
                if (input) {
                  input.indeterminate = isIndeterminate;
                }
              }}
              onChange={onToggleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        </th>
        {columns.map((col, index) => (
          <th key={index} className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              {col.icon}
              <span>{col.label}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}