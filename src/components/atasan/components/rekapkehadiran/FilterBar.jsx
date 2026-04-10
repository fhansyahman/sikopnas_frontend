"use client";

import { SearchBar } from "./SearchBar";
import { FilterChips } from "./FilterChips";
import { FilterActions } from "./FilterActions";

export function FilterBar({
  search,
  onSearchChange,
  bulanFilter,
  onBulanChange,
  tahunFilter,
  onTahunChange,
  wilayahFilter,
  onWilayahChange,
  onReset,
  onSetCurrentMonth,
  activeFilterCount,
  bulanOptions,
  tahunOptions,
  wilayahOptions,
  showExport,
  onExport,
  onPrint
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <SearchBar 
          search={search} 
          onSearchChange={onSearchChange} 
        />
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <select
              value={bulanFilter}
              onChange={(e) => onBulanChange(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            >
              <option value="">Pilih Bulan</option>
              {bulanOptions.map(bulan => (
                <option key={bulan.value} value={bulan.value}>
                  {bulan.label}
                </option>
              ))}
            </select>
            
            <select
              value={tahunFilter}
              onChange={(e) => onTahunChange(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            >
              <option value="">Pilih Tahun</option>
              {tahunOptions.map(tahun => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>
            
            <select
              value={wilayahFilter}
              onChange={(e) => onWilayahChange(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            >
              <option value="">Semua Wilayah</option>
              {wilayahOptions.map(wilayah => (
                <option key={wilayah} value={wilayah}>
                  {wilayah}
                </option>
              ))}
            </select>
          </div>
          
          <FilterActions
            onReset={onReset}
            onSetCurrentMonth={onSetCurrentMonth}
            showExport={showExport}
            onExport={onExport}
            onPrint={onPrint}
          />
        </div>

        <FilterChips
          bulanFilter={bulanFilter}
          tahunFilter={tahunFilter}
          wilayahFilter={wilayahFilter}
          search={search}
          onClearBulan={() => onBulanChange('')}
          onClearTahun={() => onTahunChange('')}
          onClearWilayah={() => onWilayahChange('')}
          onClearSearch={() => onSearchChange('')}
          getBulanLabel={(val) => bulanOptions.find(b => b.value === val)?.label}
          activeFilterCount={activeFilterCount}
        />
      </div>
    </div>
  );
}