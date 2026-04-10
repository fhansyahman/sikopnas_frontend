"use client";

import { X } from "lucide-react";

export function FilterChips({
  bulanFilter,
  tahunFilter,
  wilayahFilter,
  search,
  onClearBulan,
  onClearTahun,
  onClearWilayah,
  onClearSearch,
  getBulanLabel,
  activeFilterCount
}) {
  if (activeFilterCount === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <span className="text-xs text-gray-500">Filter aktif:</span>
      
      {bulanFilter && (
        <Chip 
          label={`Bulan: ${getBulanLabel(bulanFilter)}`}
          onClear={onClearBulan}
          color="blue"
        />
      )}
      
      {tahunFilter && (
        <Chip 
          label={`Tahun: ${tahunFilter}`}
          onClear={onClearTahun}
          color="green"
        />
      )}
      
      {wilayahFilter && (
        <Chip 
          label={`Wilayah: ${wilayahFilter}`}
          onClear={onClearWilayah}
          color="purple"
        />
      )}
      
      {search && (
        <Chip 
          label={`Pencarian: ${search}`}
          onClear={onClearSearch}
          color="amber"
        />
      )}
    </div>
  );
}

function Chip({ label, onClear, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    amber: "bg-amber-100 text-amber-800"
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${colorClasses[color]}`}>
      {label}
      <button onClick={onClear} className="ml-1 hover:opacity-70">
        <X size={10} />
      </button>
    </span>
  );
}