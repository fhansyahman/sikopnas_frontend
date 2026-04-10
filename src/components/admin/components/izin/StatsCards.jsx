"use client";

import { CalendarClock, Clock3, CheckCircle, Ban } from "lucide-react";

export function StatsCards({ statistik, tanggalFilter }) {
  const cards = [
    {
      title: "Total Pengajuan",
      value: statistik.total_pengajuan || 0,
      subtext: tanggalFilter ? `Tanggal: ${tanggalFilter}` : 'Hari ini',
      icon: <CalendarClock className="w-6 h-6 text-blue-600" />,
      bgColor: "from-cyan-50 to-blue-50"
    },
    {
      title: "Pending",
      value: statistik.pending || 0,
      subtext: `${statistik.persen_pending || 0}%`,
      icon: <Clock3 className="w-6 h-6 text-amber-600" />,
      bgColor: "from-amber-50 to-orange-50",
      textColor: "text-amber-600"
    },
    {
      title: "Disetujui",
      value: statistik.disetujui || 0,
      subtext: `${statistik.persen_disetujui || 0}%`,
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Ditolak",
      value: statistik.ditolak || 0,
      subtext: `${statistik.persen_ditolak || 0}%`,
      icon: <Ban className="w-6 h-6 text-rose-600" />,
      bgColor: "from-red-50 to-rose-50",
      textColor: "text-rose-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
}

function StatsCard({ title, value, subtext, icon, bgColor, textColor = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}