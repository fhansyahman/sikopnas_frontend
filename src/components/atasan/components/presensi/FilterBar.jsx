"use client";

import { Search, X, RefreshCw, Zap, Filter, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Data wilayah
const wilayahOptions = [
  { value: "", label: "Semua Wilayah" },
  { value: "Cermee", label: "Cermee" },
  { value: "Prajekan", label: "Prajekan" },
  { value: "Botolinggo", label: "Botolinggo" },
  { value: "Klabang", label: "Klabang" },
  { value: "Ijen", label: "Ijen" }
];

// Data status
const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "Tepat Waktu", label: "Tepat Waktu" },
  { value: "Terlambat", label: "Terlambat" },
  { value: "Tanpa Keterangan", label: "Tanpa Keterangan" },
  { value: "Izin", label: "Izin" }
];

export function FilterBar({ 
  filters, 
  onFilterChange, 
  onReset, 
  onRefresh, 
  onGenerate,
  activeFilterCount,
  activeTab 
}) {
  const { user } = useAuth();
  const isAdmin = user?.roles === 'admin' || user?.roles === 'superadmin';
  const isAtasan = user?.roles === 'atasan';
  
  const handleChange = (key, value) => {
    console.log(`🔧 Filter berubah: ${key} = ${value} (tipe: ${typeof value})`);
    onFilterChange({ ...filters, [key]: value });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('🔍 Search:', value);
    handleChange('search', value);
  };

  const handleWilayahChange = (e) => {
    const value = e.target.value;
    console.log('📍 Wilayah dipilih:', value);
    handleChange('wilayah', value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    console.log('🏷️ Status dipilih:', value);
    handleChange('status', value);
  };

  const handleTanggalChange = (e) => {
    const value = e.target.value;
    console.log('📅 Tanggal dipilih:', value);
    handleChange('tanggal', value);
  };

  console.log('📊 FilterBar - filters saat ini:', filters);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
      {/* Bagian Search - BARIS PERTAMA */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau jabatan..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Bagian Filter - BARIS KEDUA */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Filter Status */}
        <select
          value={filters.status || ''}
          onChange={handleStatusChange}
          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 min-w-[150px]"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        {/* Filter Wilayah - Conditional berdasarkan role */}
        {isAdmin ? (
          <select
            value={filters.wilayah || ''}
            onChange={handleWilayahChange}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 min-w-[150px]"
          >
            {wilayahOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : isAtasan && user?.wilayah_penugasan ? (
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg min-w-[150px]">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {user.wilayah_penugasan}
            </span>
          </div>
        ) : null}
        
        {/* Filter Tanggal */}
        <input
          type="date"
          value={filters.tanggal || ''}
          onChange={handleTanggalChange}
          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
        />
        
        {/* Action Buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={onRefresh}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-3 bg-gray-200 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium shadow-sm"
            >
              <X size={16} />
              Reset Filter
            </button>
          )}
          
          {/* Tombol Generate - Hanya untuk admin */}
          {activeTab === 'data' && isAdmin && (
            <button
              onClick={onGenerate}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium shadow-sm"
            >
              <Zap size={16} />
              Generate
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Info */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Filter aktif:</span>
          
          {filters.status && (
            <FilterTag
              label={`Status: ${filters.status}`}
              onRemove={() => handleChange('status', '')}
            />
          )}
          
          {/* Hanya tampilkan tag wilayah jika berbeda dari default user */}
          {filters.wilayah && filters.wilayah !== user?.wilayah_penugasan && (
            <FilterTag
              label={`Wilayah: ${filters.wilayah}`}
              onRemove={() => handleChange('wilayah', user?.wilayah_penugasan || '')}
            />
          )}
          
          {filters.tanggal && filters.tanggal !== new Date().toISOString().split('T')[0] && (
            <FilterTag
              label={`Tanggal: ${formatTanggal(filters.tanggal)}`}
              onRemove={() => {
                const today = new Date().toISOString().split('T')[0];
                handleChange('tanggal', today);
              }}
            />
          )}
          
          {filters.search && (
            <FilterTag
              label={`Pencarian: "${filters.search}"`}
              onRemove={() => handleChange('search', '')}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
      {label}
      <button onClick={onRemove} className="ml-1 hover:text-blue-600">
        <X size={10} />
      </button>
    </span>
  );
}

// Helper function untuk format tanggal
function formatTanggal(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}