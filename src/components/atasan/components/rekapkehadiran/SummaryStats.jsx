"use client";

import { FileBarChart2, Download } from "lucide-react";

export function SummaryStats({ 
  statistik, 
  bulanFilter, 
  tahunFilter, 
  getBulanLabel,
  getDaysInMonth,
  onExport 
}) {
  const totalKehadiran = statistik.totalHadir + statistik.totalTerlambat;
  const totalKetidakhadiran = statistik.totalIzin + statistik.totalTanpaKeterangan;

  const getStatusBadge = () => {
    const percentage = statistik.persenHadir || 0;
    if (percentage >= 90) return { label: 'Sangat Baik', color: 'bg-green-100 text-green-800' };
    if (percentage >= 80) return { label: 'Baik', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Perlu Perbaikan', color: 'bg-red-100 text-red-800' };
  };

  const statusBadge = getStatusBadge();
  const daysInMonth = bulanFilter && tahunFilter ? 
    getDaysInMonth(parseInt(tahunFilter), parseInt(bulanFilter)) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileBarChart2 size={20} className="text-blue-500" />
          Ringkasan Statistik
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Detail perhitungan statistik kehadiran
        </p>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Pegawai</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">{statistik.totalPegawai}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Hari Kerja</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">{daysInMonth}</p>
            </div>
          </div>
        </div>
        
        <StatBox
          color="green"
          label="Kehadiran"
          value={totalKehadiran}
          subLabel="Rata-rata per pegawai"
          average={statistik.totalPegawai > 0 ? Math.round(totalKehadiran / statistik.totalPegawai) : 0}
        />
        
        <StatBox
          color="red"
          label="Ketidakhadiran"
          value={totalKetidakhadiran}
          subLabel="Rata-rata per pegawai"
          average={statistik.totalPegawai > 0 ? Math.round(totalKetidakhadiran / statistik.totalPegawai) : 0}
        />
        
        <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-blue-700">Tingkat Kehadiran</p>
              <p className="text-xl md:text-2xl font-bold text-blue-800">
                {statistik.persenHadir}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm text-blue-600">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium"
        >
          <Download size={16} />
          Export Data Statistik
        </button>
      </div>
    </div>
  );
}

function StatBox({ color, label, value, subLabel, average }) {
  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      value: "text-green-800"
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      value: "text-red-800"
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`p-3 md:p-4 ${colors.bg} rounded-lg border ${colors.border}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <p className={`text-sm font-medium ${colors.text}`}>{label}</p>
          <p className={`text-base md:text-lg font-bold ${colors.value}`}>
            {value} kali
          </p>
        </div>
        <div className="text-right">
          <p className={`text-xs md:text-sm ${colors.text}`}>{subLabel}</p>
          <p className={`text-base md:text-lg font-bold ${colors.value}`}>
            {average} hari
          </p>
        </div>
      </div>
    </div>
  );
}