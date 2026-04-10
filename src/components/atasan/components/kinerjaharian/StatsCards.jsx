"use client";

import { FileText, Users, Ruler } from "lucide-react";

export function StatsCards({ statistik, selectedDate, tanggalInfo }) {
  const cards = [
    {
      title: "Total Laporan",
      value: statistik?.total_laporan || 0,
      subtitle: tanggalInfo ? `${tanggalInfo.tanggal_formatted}` : `Tanggal: ${selectedDate || '-'}`,
      icon: <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />,
      bgColor: "from-cyan-50 to-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Total Pegawai",
      value: statistik?.total_pegawai || 0,
      subtitle: "Yang melaporkan",
      icon: <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />,
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Total Panjang KR",
      value: `${statistik?.total_panjang_kr || 0} m`,
      subtitle: "Total keseluruhan",
      icon: <Ruler className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />,
      bgColor: "from-amber-50 to-orange-50",
      textColor: "text-amber-600"
    },
    {
      title: "Total Panjang KN",
      value: `${statistik?.total_panjang_kn || 0} m`,
      subtitle: "Total keseluruhan",
      icon: <Ruler className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />,
      bgColor: "from-purple-50 to-violet-50",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">{card.title}</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-400 mt-1 truncate">
                {card.subtitle}
              </p>
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${card.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}