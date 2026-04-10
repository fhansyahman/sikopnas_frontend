"use client";

import { Users, CheckCircle, AlertCircle, ClipboardList } from "lucide-react";

export function StatsCards({ statistik, tanggalFilter }) {
  const stats = [
    {
      title: "Total Pegawai",
      value: statistik.total_pegawai || 0,
      subtitle: tanggalFilter ? `Tanggal: ${tanggalFilter}` : 'Hari ini',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bgColor: "from-cyan-50 to-blue-50",
      textColor: "text-gray-800"
    },
    {
      title: "Hadir",
      value: statistik.total_hadir || 0,
      percentage: statistik.persen_hadir || 0,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-green-600"
    },
    {
      title: "Terlambat",
      value: statistik.total_terlambat || 0,
      percentage: statistik.persen_terlambat || 0,
      icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
      bgColor: "from-amber-50 to-orange-50",
      textColor: "text-amber-600"
    },
    {
      title: "Izin",
      value: statistik.total_izin || 0,
      percentage: statistik.persen_izin || 0,
      icon: <ClipboardList className="w-6 h-6 text-purple-600" />,
      bgColor: "from-purple-50 to-pink-50",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

function StatCard({ title, value, subtitle, percentage, icon, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {percentage !== undefined && (
            <p className="text-sm text-gray-600 mt-1">{percentage}%</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}