"use client";

import { BookOpen } from "lucide-react";

export function StatsCard({ 
  stats, 
  presentase, 
  totalData, 
  filteredCount,
  selectedMonth,
  selectedYear,
  getMonthName 
}) {
  const getTitle = () => {
    if (!selectedMonth && !selectedYear) return "Semua Data";
    if (selectedMonth && selectedYear) return `Bulan ${getMonthName(selectedMonth)} ${selectedYear}`;
    return "Ringkasan Hasil Filter";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{getTitle()}</h2>
          <span className="text-sm text-gray-500">{filteredCount} hari</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex-1">
            <p className="text-2xl font-bold text-indigo-600">{presentase}%</p>
            <p className="text-gray-600 text-sm">Tingkat Kehadiran</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-gray-500">Total Data</p>
            <p className="font-semibold text-lg">{totalData} hari</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatItem 
            color="bg-green-500" 
            value={stats.hadir} 
            label="Hadir" 
            subValue={stats.hadir_pemutihan > 0 ? `(${stats.hadir_pemutihan})` : null}
          />
          <StatItem 
            color="bg-amber-400" 
            value={stats.terlambat} 
            label="Terlambat" 
          />
          <StatItem 
            color="bg-purple-400" 
            value={stats.izin + stats.sakit} 
            label="Izin & Sakit" 
          />
          <StatItem 
            color="bg-gray-400" 
            value={stats.tanpa_keterangan} 
            label="Tanpa Keterangan" 
          />
        </div>
        
        {stats.hadir_pemutihan > 0 && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-start">
              <BookOpen className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-emerald-700 font-medium">
                  📝 Ada {stats.hadir_pemutihan} hari dengan status pemutihan
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  (Hari yang lupa presensi tapi dianggap hadir)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatItem({ color, value, label, subValue }) {
  return (
    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
      <div className={`w-3 h-3 ${color} rounded-full`}></div>
      <div>
        <p className="font-semibold text-gray-700">{value}</p>
        <p className="text-xs text-gray-600">
          {label}
          {subValue && <span className="text-emerald-600 font-medium ml-1">{subValue}</span>}
        </p>
      </div>
    </div>
  );
}