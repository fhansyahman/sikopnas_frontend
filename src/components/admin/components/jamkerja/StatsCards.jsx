"use client";

import { Clock, CheckCircle, AlertCircle, Activity } from "lucide-react";

export function StatsCards({ stats, jamKerja }) {
  const cards = [
    {
      title: "Total Setting",
      value: stats.total,
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      bgColor: "from-cyan-50 to-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Setting Aktif",
      value: stats.aktif,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-green-600"
    },
    {
      title: "Setting Nonaktif",
      value: stats.nonaktif,
      icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
      bgColor: "from-amber-50 to-yellow-50",
      textColor: "text-amber-600"
    },
    {
      title: "Rata-rata Jam Kerja",
      value: stats.rataJamKerja,
      icon: <Activity className="w-6 h-6 text-purple-600" />,
      bgColor: "from-purple-50 to-violet-50",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${card.bgColor} rounded-xl flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}