'use client';

import { RefreshCw, X, CalendarDays } from "lucide-react";

export function FilterBar({
  selectedWilayah,
  selectedDate,
  onWilayahChange,
  onDateChange,
  onRefresh,
  onReset,
  formatDateShort
}) {
  const wilayahOptions = [
    { value: "", label: "Semua Wilayah" },
    { value: "Cermee", label: "Cermee" },
    { value: "Botolinggo", label: "Botolinggo" },
    { value: "Prajekan", label: "Prajekan" },
    { value: "Klabang", label: "Klabang" },
  ];

  const hasActiveFilter = selectedWilayah || selectedDate !== new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <select
            value={selectedWilayah}
            onChange={(e) => onWilayahChange(e.target.value)}
            className="w-full md:w-auto px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
          >
            {wilayahOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 border border-gray-300 text-white rounded-lg hover:bg-gray-200 text-sm font-medium shadow-sm flex-1 md:flex-none"
          >
            <RefreshCw size={16} />
            <span className="hidden md:inline">Refresh</span>
          </button>
          
          {hasActiveFilter && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium shadow-sm flex-1 md:flex-none"
            >
              <X size={16} />
              <span className="hidden md:inline">Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Active Info */}
      {hasActiveFilter && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-gray-500">Filter aktif:</span>
          {selectedWilayah && (
            <FilterBadge
              label={`Wilayah: ${selectedWilayah}`}
              onRemove={() => onWilayahChange('')}
            />
          )}
          {selectedDate !== new Date().toISOString().split('T')[0] && (
            <FilterBadge
              label={`Tanggal: ${formatDateShort(selectedDate)}`}
              onRemove={() => onDateChange(new Date().toISOString().split('T')[0])}
              icon
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterBadge({ label, onRemove, icon }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
      {icon && <CalendarDays size={10} className="mr-1" />}
      {label}
      <button onClick={onRemove} className="ml-1">
        <X size={10} />
      </button>
    </span>
  );
}