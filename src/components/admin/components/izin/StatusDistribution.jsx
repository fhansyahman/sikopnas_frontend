"use client";

import { BarChart3 } from "lucide-react";

export function StatusDistribution({ statistik, tanggalFilter }) {
  const items = [
    { 
      label: "Disetujui", 
      value: statistik.disetujui || 0, 
      percentage: statistik.persen_disetujui || 0,
      color: "bg-emerald-500",
      textColor: "text-emerald-600"
    },
    { 
      label: "Ditolak", 
      value: statistik.ditolak || 0, 
      percentage: statistik.persen_ditolak || 0,
      color: "bg-rose-500",
      textColor: "text-rose-600"
    },
    { 
      label: "Pending", 
      value: statistik.pending || 0, 
      percentage: statistik.persen_pending || 0,
      color: "bg-amber-500",
      textColor: "text-amber-600"
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-500" />
          Distribusi Status Izin
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Statistik izin berdasarkan status {tanggalFilter && `pada ${tanggalFilter}`}
        </p>
      </div>
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <StatusBar key={index} {...item} />
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Data Izin</p>
            <p className="text-lg font-bold text-gray-900">{statistik.total_pengajuan || 0} record</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Periode</p>
            <p className="text-sm font-medium text-gray-900">
              {tanggalFilter || new Date().toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBar({ label, value, percentage, color, textColor }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <span className="text-sm text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className={`font-semibold ${textColor}`}>{percentage}%</span>
          <p className="text-xs text-gray-400">{value} pengajuan</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}