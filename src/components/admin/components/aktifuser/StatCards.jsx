"use client";

import { Users2, UserCheck2, UserX } from "lucide-react";

export function StatCards({ statistik }) {
  const cards = [
    {
      title: "Total Pegawai",
      value: statistik.total_pegawai || 0,
      icon: <Users2 className="w-6 h-6 text-blue-600" />,
      bgColor: "from-cyan-50 to-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Aktif",
      value: statistik.aktif || 0,
      percentage: statistik.persen_aktif || 0,
      icon: <UserCheck2 className="w-6 h-6 text-emerald-600" />,
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Nonaktif",
      value: statistik.nonaktif || 0,
      percentage: statistik.persen_nonaktif || 0,
      icon: <UserX className="w-6 h-6 text-rose-600" />,
      bgColor: "from-red-50 to-rose-50",
      textColor: "text-rose-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

function StatCard({ title, value, percentage, icon, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
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