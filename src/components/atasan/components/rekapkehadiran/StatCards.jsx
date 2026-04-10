"use client";

import { Users, UserCheck, Clock, FileCheck } from "lucide-react";

export function StatCards({ statistik }) {
  const cards = [
    {
      label: "Total Pegawai",
      value: statistik.totalPegawai || 0,
      subLabel: "Periode aktif",
      icon: Users,
      color: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600"
    },
    {
      label: "Hadir",
      value: statistik.totalHadir || 0,
      subLabel: `${statistik.persenHadir || 0}%`,
      icon: UserCheck,
      color: "from-green-50 to-emerald-50",
      iconColor: "text-green-600",
      valueColor: "text-green-600"
    },
    {
      label: "Terlambat",
      value: statistik.totalTerlambat || 0,
      subLabel: `${statistik.persenTerlambat || 0}%`,
      icon: Clock,
      color: "from-amber-50 to-orange-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600"
    },
    {
      label: "Izin",
      value: statistik.totalIzin || 0,
      subLabel: `${statistik.persenIzin || 0}%`,
      icon: FileCheck,
      color: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600",
      valueColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

function StatCard({ label, value, subLabel, icon: Icon, color, iconColor, valueColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-xl md:text-2xl font-bold mt-1 ${valueColor || 'text-gray-800'}`}>
            {value}
          </p>
          <p className="text-xs text-gray-400 mt-1 truncate">{subLabel}</p>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}