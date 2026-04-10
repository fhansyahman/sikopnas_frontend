"use client";

import { Search, RefreshCw, X, Filter, PlusCircle } from "lucide-react";

export function ActionBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  jenisFilter,
  onJenisFilterChange,
  tanggalFilter,
  onTanggalFilterChange,
  onRefresh,
  onReset,
  showResetButton,
  onCreateClick // Tambahkan prop ini
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama pegawai, jenis izin, atau keterangan..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            >
              <option value="">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
            
            <select
              value={jenisFilter}
              onChange={(e) => onJenisFilterChange(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            >
              <option value="">Semua Jenis</option>
              <option value="Sakit">Sakit</option>
              <option value="Izin">Izin</option>
              <option value="Dinas Luar">Dinas Luar</option>
            </select>
            
            <input
              type="date"
              value={tanggalFilter}
              onChange={(e) => onTanggalFilterChange(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            />
          </div>
          
          <div className="flex gap-3">
            {/* Tombol Create Izin */}
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium shadow-sm"
              title="Buat Izin untuk Pegawai"
            >
              <PlusCircle size={16} />
              <span className="hidden md:inline">Buat Izin</span>
            </button>

            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 border border-gray-300 text-white rounded-lg hover:bg-gray-200 text-sm font-medium shadow-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            
            {showResetButton && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-3 bg-gray-200 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium shadow-sm"
              >
                <X size={16} />
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}