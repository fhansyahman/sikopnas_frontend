"use client";

import { Filter } from "lucide-react";

export function FilterSection({
  selectedMonth,
  selectedYear,
  availableMonths,
  availableYears,
  months,
  onMonthChange,
  onYearChange,
  onReset,
  onSetCurrentMonth,
  totalData,
  filteredCount
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter Data
        </p>
        <div className="flex items-center space-x-2">
          {(selectedMonth || selectedYear) && (
            <button
              onClick={onReset}
              className="text-xs text-gray-600 hover:text-gray-800 font-medium px-3 py-1 bg-gray-100 rounded-lg"
            >
              Tampilkan Semua
            </button>
          )}
          <button
            onClick={onSetCurrentMonth}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 bg-indigo-50 rounded-lg"
          >
            Bulan Ini
          </button>
        </div>
      </div>
      
      <div className="flex gap-3">
        <SelectField
          value={selectedMonth}
          onChange={onMonthChange}
          options={months}
          placeholder="Pilih Bulan"
        />
        
        <SelectField
          value={selectedYear}
          onChange={onYearChange}
          options={availableYears}
          placeholder="Pilih Tahun"
        />
      </div>
      
      {(selectedMonth || selectedYear) && (
        <p className="text-xs text-gray-500 mt-2">
          Menampilkan {filteredCount} dari {totalData} total data
        </p>
      )}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <div className="flex-1 relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 outline-none appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        ▼
      </div>
    </div>
  );
}