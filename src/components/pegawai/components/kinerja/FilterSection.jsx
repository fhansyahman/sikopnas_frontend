"use client";

import { Search } from "lucide-react";

export function FilterSection({
  selectedMonth,
  selectedYear,
  searchTerm,
  availableYears,
  onMonthChange,
  onYearChange,
  onSearchChange
}) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleDateString('id-ID', { month: 'long' })
  }));

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex gap-4 flex-1">
        <div className="flex-1">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {availableYears.length > 0 ? (
              availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <>
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>
                <option value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </option>
              </>
            )}
          </select>
        </div>
      </div>
      
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan ruas jalan atau kegiatan..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  );
}