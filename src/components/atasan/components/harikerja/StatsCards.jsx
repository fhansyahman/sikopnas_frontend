"use client";

import { Workflow, PartyPopper, CalendarDays, Calendar } from "lucide-react";

export function StatsCards({ totalHariKerja, totalHariLibur, totalHariBulan, tahunFilter }) {
  const stats = [
    {
      title: "Total Hari Kerja",
      value: totalHariKerja,
      icon: <Workflow className="w-6 h-6 text-green-600" />,
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-green-600"
    },
    {
      title: "Total Hari Libur",
      value: totalHariLibur,
      icon: <PartyPopper className="w-6 h-6 text-purple-600" />,
      bgColor: "from-purple-50 to-violet-50",
      textColor: "text-purple-600"
    },
    {
      title: "Hari dalam Bulan",
      value: totalHariBulan,
      icon: <CalendarDays className="w-6 h-6 text-blue-600" />,
      bgColor: "from-blue-50 to-cyan-50",
      textColor: "text-blue-600"
    },
    {
      title: "Tahun Aktif",
      value: tahunFilter,
      icon: <Calendar className="w-6 h-6 text-amber-600" />,
      bgColor: "from-amber-50 to-yellow-50",
      textColor: "text-amber-600"
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

function StatCard({ title, value, icon, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}