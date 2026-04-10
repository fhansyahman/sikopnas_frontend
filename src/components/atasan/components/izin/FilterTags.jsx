"use client";

import { X, CalendarDays, MapPin } from "lucide-react";

export function FilterTags({ 
  statusFilter, 
  jenisFilter, 
  tanggalFilter,
  wilayahFilter,
  onClearStatus,
  onClearJenis,
  onClearTanggal,
  onClearWilayah,
  user // Tambahkan prop user untuk mengetahui default wilayah
}) {
  const today = new Date().toISOString().split('T')[0];
  const defaultWilayah = user?.wilayah_penugasan || '';
  
  const hasActiveFilters = statusFilter || jenisFilter || 
    (tanggalFilter && tanggalFilter !== today) ||
    (wilayahFilter && wilayahFilter !== defaultWilayah);

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-xs text-gray-500 self-center">Filter aktif:</span>
      
      {/* Filter Wilayah - hanya tampil jika berbeda dari default user */}
      {wilayahFilter && wilayahFilter !== defaultWilayah && (
        <FilterTag
          icon={<MapPin size={10} />}
          label={`Wilayah: ${wilayahFilter}`}
          onClear={onClearWilayah}
        />
      )}
      
      {statusFilter && (
        <FilterTag
          label={`Status: ${statusFilter}`}
          onClear={onClearStatus}
        />
      )}
      
      {jenisFilter && (
        <FilterTag
          label={`Jenis: ${jenisFilter}`}
          onClear={onClearJenis}
        />
      )}
      
      {tanggalFilter && tanggalFilter !== today && (
        <FilterTag
          icon={<CalendarDays size={10} />}
          label={`Tanggal: ${formatDate(tanggalFilter)}`}
          onClear={onClearTanggal}
        />
      )}
    </div>
  );
}

function FilterTag({ icon, label, onClear }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
      {icon && <span className="mr-1">{icon}</span>}
      {label}
      <button onClick={onClear} className="ml-1 hover:text-blue-900">
        <X size={10} />
      </button>
    </span>
  );
}

// Helper function untuk format tanggal
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}