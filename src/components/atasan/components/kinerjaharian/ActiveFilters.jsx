"use client";

import { X, CalendarDays, Search } from "lucide-react";

export function ActiveFilters({
  wilayahFilter,
  setWilayahFilter,
  selectedDate,
  setSelectedDate,
  search,
  setSearch
}) {
  const hasFilters = wilayahFilter || search;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <span className="text-xs text-gray-500">Filter aktif:</span>
      
      {search && (
        <FilterTag
          icon={<Search size={10} />}
          label={`Pencarian: "${search}"`}
          onRemove={() => setSearch('')}
          color="gray"
        />
      )}
      
      {wilayahFilter && (
        <FilterTag
          label={`Wilayah: ${wilayahFilter}`}
          onRemove={() => setWilayahFilter('')}
          color="blue"
        />
      )}
    </div>
  );
}

function FilterTag({ icon, label, onRemove, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    gray: "bg-gray-100 text-gray-800"
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${colorClasses[color]}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {label}
      <button onClick={onRemove} className="ml-1 hover:opacity-75">
        <X size={10} />
      </button>
    </span>
  );
}