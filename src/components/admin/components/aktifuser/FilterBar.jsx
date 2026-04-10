"use client";

import { Search, Filter, RefreshCw, X } from "lucide-react";

export function FilterBar({
  search,
  onSearchChange,
  aktivasiFilter,
  onAktivasiFilterChange,
  onRefresh,
  onResetFilters,
  hasActiveFilters
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full">
          <SearchInput value={search} onChange={onSearchChange} />
        </div>
        
        <div className="flex items-center gap-4">
          <FilterSelect
            value={aktivasiFilter}
            onChange={onAktivasiFilterChange}
          />
          
          <ActionButtons
            onRefresh={onRefresh}
            onReset={onResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>

      <ActiveFilters
        aktivasiFilter={aktivasiFilter}
        onClearFilter={() => onAktivasiFilterChange('')}
      />
    </div>
  );
}

function SearchInput({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Cari nama, jabatan, username, atau wilayah..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800 placeholder-gray-500"
      />
    </div>
  );
}

function FilterSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
    >
      <option value="">Semua Status</option>
      <option value="aktif">Aktif</option>
      <option value="nonaktif">Nonaktif</option>
    </select>
  );
}

function ActionButtons({ onRefresh, onReset, hasActiveFilters }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-3 bg-blue-600  text-white-700 rounded-lg hover:bg-gray-200 text-sm font-medium shadow-sm"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
      
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-3 bg-gray-200 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium shadow-sm"
        >
          <X size={16} />
          Reset Filter
        </button>
      )}
    </div>
  );
}

function ActiveFilters({ aktivasiFilter, onClearFilter }) {
  if (!aktivasiFilter) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
        Aktivasi: {aktivasiFilter}
        <button onClick={onClearFilter} className="ml-1">
          <X size={10} />
        </button>
      </span>
    </div>
  );
}