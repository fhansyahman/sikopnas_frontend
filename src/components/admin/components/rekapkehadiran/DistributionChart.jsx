"use client";

import { PieChart } from "lucide-react";

export function DistributionChart({ statistik }) {
  const items = [
    {
      label: "Hadir",
      value: statistik.persenHadir || 0,
      count: statistik.totalHadir || 0,
      color: "bg-green-500"
    },
    {
      label: "Terlambat",
      value: statistik.persenTerlambat || 0,
      count: statistik.totalTerlambat || 0,
      color: "bg-amber-500"
    },
    {
      label: "Izin",
      value: statistik.persenIzin || 0,
      count: statistik.totalIzin || 0,
      color: "bg-purple-500"
    },
    {
      label: "Tanpa Keterangan",
      value: statistik.persenTanpaKeterangan || 0,
      count: statistik.totalTanpaKeterangan || 0,
      color: "bg-red-500"
    }
  ];

  const totalPresensi = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <PieChart size={20} className="text-blue-500" />
          Distribusi Kehadiran
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Statistik presensi berdasarkan status pada periode yang dipilih
        </p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        {items.map((item, index) => (
          <DistributionItem
            key={index}
            label={item.label}
            value={item.value}
            count={item.count}
            color={item.color}
            total={totalPresensi}
          />
        ))}
      </div>
      
      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Data Presensi</p>
            <p className="text-lg font-bold text-gray-900">
              {totalPresensi} record
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistributionItem({ label, value, count, color, total }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <span className="text-sm text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className="font-semibold text-gray-900">{value}%</span>
          <p className="text-xs text-gray-400">
            {count} data
          </p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-500`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}