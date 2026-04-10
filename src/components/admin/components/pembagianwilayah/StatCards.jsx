"use client";

import { MapPin, UserCheck, UserX, TrendingUp } from "lucide-react";

export function StatCards({ wilayahList, usersList, wilayahStats }) {
  const stats = [
    {
      label: "Total Wilayah",
      value: wilayahList.length,
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      bg: "from-cyan-50 to-blue-50",
      color: "text-blue-600"
    },
    {
      label: "Total Pegawai",
      value: usersList.filter(u => u.is_active).length,
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      bg: "from-green-50 to-emerald-50",
      color: "text-green-600"
    },
    {
      label: "Tanpa Wilayah",
      value: wilayahStats.no_wilayah_total || 0,
      icon: <UserX className="w-6 h-6 text-amber-600" />,
      bg: "from-amber-50 to-orange-50",
      color: "text-amber-600"
    },
    {
      label: "Distribusi Wilayah",
      value: Array.isArray(wilayahStats.wilayah_stats) ? wilayahStats.wilayah_stats.length : 0,
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      bg: "from-purple-50 to-pink-50",
      color: "text-purple-600"
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

function StatCard({ label, value, icon, bg, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${bg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}