"use client";

import { RefreshCw, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export function FilterBar({
  wilayahFilter,
  setWilayahFilter,
  selectedDate,
  setSelectedDate,
  onRefresh,
  onReset,
  hasActiveFilters,
  onPreviousDay,
  onNextDay,
  onToday,
  userWilayah // Props baru untuk menampilkan wilayah user
}) {
  const wilayahOptions = [
    { value: "", label: "Semua Wilayah" },
    { value: "Cermee", label: "Cermee" },
    { value: "Botolinggo", label: "Botolinggo" },
    { value: "Prajekan", label: "Prajekan" },
    { value: "Klabang", label: "Klabang" },
  ];

  // Format tanggal untuk display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Cari label wilayah berdasarkan value
  const getWilayahLabel = (value) => {
    const option = wilayahOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="flex flex-col gap-3 text-black">
      {/* Filter Controls - Gabungan baris pertama */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Wilayah Filter - DISABLED / READ ONLY */}
        <div className="flex-1">
          <div className="relative">
            <label className="absolute -top-2 left-2 px-1 bg-white text-xs text-gray-500 z-10">
              Wilayah Penugasan
            </label>
            <select
              value={wilayahFilter}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-not-allowed"
            >
              {wilayahOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {userWilayah && (
              <p className="text-xs text-gray-500 mt-1">
                * Wilayah sesuai atasan penugasan, tidak dapat diubah
              </p>
            )}
          </div>
        </div>

        {/* Date Navigation yang lebih kompak */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={onPreviousDay}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Hari sebelumnya"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-200">
            <Calendar size={16} className="text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-36 focus:outline-none text-sm"
            />
          </div>
          
          <button
            onClick={onToday}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors whitespace-nowrap"
          >
            Hari Ini
          </button>
          
          <button
            onClick={onNextDay}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Hari berikutnya"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium shadow-sm"
            >
              <X size={16} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Display selected date - lebih terintegrasi */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
        <span className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>Menampilkan data untuk:</span>
          <span className="font-semibold text-gray-800">{formatDateDisplay(selectedDate)}</span>
        </span>
        
        {/* Tampilkan wilayah yang sedang aktif */}
        <span className="flex items-center gap-2">
          <span className="text-gray-400">|</span>
          <span>Wilayah: </span>
          <span className="font-semibold text-blue-600">{getWilayahLabel(wilayahFilter) || 'Semua'}</span>
        </span>
      </div>
    </div>
  );
}