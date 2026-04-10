"use client";

import { RefreshCw } from "lucide-react";
import { RekapTable } from "./RekapTable";

export function RekapTab({
  processing,
  bulanFilter,
  tahunFilter,
  wilayahFilter,
  search,
  rekapBulanan,
  statistikBulanan,
  getBulanLabel,
  onRefresh,
  getDaysInMonth
}) {
  // Pastikan rekapBulanan adalah array
  const safeRekapBulanan = Array.isArray(rekapBulanan) ? rekapBulanan : [];
  const safeStatistik = statistikBulanan || {
    totalPegawai: 0,
    totalHadir: 0,
    totalTerlambat: 0,
    totalIzin: 0,
    totalTanpaKeterangan: 0,
    persenHadir: 0,
    persenTerlambat: 0,
    persenIzin: 0,
    persenTanpaKeterangan: 0
  };

  if (!bulanFilter || !tahunFilter) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Silakan pilih bulan dan tahun terlebih dahulu</p>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Memproses data...</span>
      </div>
    );
  }

  if (safeRekapBulanan.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          Tidak ada data untuk {getBulanLabel(bulanFilter)} {tahunFilter}
          {wilayahFilter && ` - Wilayah: ${wilayahFilter}`}
          {search && ` - Pencarian: ${search}`}
        </p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Rekap Kehadiran {getBulanLabel(bulanFilter)} {tahunFilter}
          </h3>
          <p className="text-sm text-gray-500">
            Menampilkan {safeRekapBulanan.length} pegawai
            {wilayahFilter && ` - Wilayah: ${wilayahFilter}`}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-green-600">H: {safeStatistik.totalHadir}</span>
          <span className="text-sm text-yellow-600">T: {safeStatistik.totalTerlambat}</span>
          <span className="text-sm text-purple-600">I: {safeStatistik.totalIzin}</span>
          <span className="text-sm text-red-600">TK: {safeStatistik.totalTanpaKeterangan}</span>
        </div>
      </div>
      
      <RekapTable 
        rekapBulanan={safeRekapBulanan}
        tahunFilter={tahunFilter}
        bulanFilter={bulanFilter}
        statistikBulanan={safeStatistik}
        getDaysInMonth={getDaysInMonth}
      />
    </div>
  );
}