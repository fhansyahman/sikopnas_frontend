"use client";

import { X, CalendarDays } from "lucide-react";

export function FilterTags({ 
  statusFilter, 
  jenisFilter, 
  tanggalFilter,
  onClearStatus,
  onClearJenis,
  onClearTanggal
}) {
  const hasActiveFilters = statusFilter || jenisFilter || 
    (tanggalFilter && tanggalFilter !== new Date().toISOString().split('T')[0]);

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-xs text-gray-500 self-center">Filter aktif:</span>
      
      {statusFilter && (
        <FilterTag
          label={`Status: ${statusFilter}`}
          onClear={onClearStatus}
        />
      )}
      
      {jenisFilter && (
        <FilterTag
          label={`Jenis: ${jenisFilter}`}
          onClear={onClearJenis}
        />
      )}
      
      {tanggalFilter && tanggalFilter !== new Date().toISOString().split('T')[0] && (
        <FilterTag
          label={
            <span className="flex items-center gap-1">
              <CalendarDays size={10} />
              Tanggal: {tanggalFilter}
            </span>
          }
          onClear={onClearTanggal}
        />
      )}
    </div>
  );
}

function FilterTag({ label, onClear }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
      {label}
      <button onClick={onClear} className="ml-1 hover:text-blue-900">
        <X size={10} />
      </button>
    </span>
  );
}