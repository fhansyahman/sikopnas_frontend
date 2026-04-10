'use client';

import { Building, FileText } from "lucide-react";
import { TableRow } from "./TableRow";

export function RekapWilayahView({
  groupedByWilayah,
  selectedWilayah,
  selectedDate,
  formatDateShort,
  onViewDetail,
  onDownloadPerorangan
}) {
  const wilayahKeys = Object.keys(groupedByWilayah);

  if (wilayahKeys.length === 0) {
    return (
      <EmptyState
        message={selectedWilayah || selectedDate !== new Date().toISOString().split('T')[0]
          ? 'Tidak ada data kinerja untuk filter yang dipilih'
          : 'Belum ada data kinerja hari ini'
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {wilayahKeys.map(wilayah => {
        const items = groupedByWilayah[wilayah];
        const totalKR = items.reduce((sum, item) => sum + (parseFloat(item.panjang_kr) || 0), 0);
        const totalKN = items.reduce((sum, item) => sum + (parseFloat(item.panjang_kn) || 0), 0);
        const uniquePegawai = [...new Set(items.map(item => item.nama))].length;

        return (
          <WilayahGroup
            key={wilayah}
            wilayah={wilayah}
            items={items}
            totalKR={totalKR}
            totalKN={totalKN}
            uniquePegawai={uniquePegawai}
            tanggal={selectedDate}
            formatDateShort={formatDateShort}
            onViewDetail={onViewDetail}
            onDownloadPerorangan={onDownloadPerorangan}
          />
        );
      })}
    </div>
  );
}

function WilayahGroup({
  wilayah,
  items,
  totalKR,
  totalKN,
  uniquePegawai,
  tanggal,
  formatDateShort,
  onViewDetail,
  onDownloadPerorangan
}) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{wilayah}</h3>
            <p className="text-sm text-gray-600">
              {uniquePegawai} pekerja • {items.length} laporan • {formatDateShort(tanggal)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <StatBadge label="Total KR" value={`${totalKR.toFixed(1)} m`} color="amber" />
          <StatBadge label="Total KN" value={`${totalKN.toFixed(1)} m`} color="purple" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Nama Pekerja</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Ruas Jalan</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Kegiatan</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">KR (m)</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">KN (m)</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <TableRow
                key={index}
                item={item}
                onViewDetail={onViewDetail}
                onDownloadPerorangan={onDownloadPerorangan}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }) {
  const colorClasses = {
    amber: 'text-amber-600',
    purple: 'text-purple-600'
  };

  return (
    <div className="text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}