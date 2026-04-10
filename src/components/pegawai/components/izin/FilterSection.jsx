"use client";

import { Filter } from "lucide-react";

export function FilterSection({
  showFilter,
  isFilterActive,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onToggleFilter,
  onResetFilter,
  getAvailableMonths,
  getAvailableYears,
  getMonthName
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggleFilter}
        className="w-full sm:w-auto flex items-center justify-center border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
      >
        <Filter className="w-4 h-4 mr-2" />
        <span>Filter</span>
        {isFilterActive && (
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Aktif
          </span>
        )}
      </button>
      
      {showFilter && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Filter Data</span>
              {isFilterActive && (
                <button
                  onClick={onResetFilter}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Bulan
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => onMonthChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Semua Bulan</option>
                  {getAvailableMonths().map(month => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tahun
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => onYearChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Semua Tahun</option>
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onToggleFilter}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}