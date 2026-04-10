'use client';

import { Users, FileText, Ruler } from "lucide-react";

export function StatCards({ statistik, selectedWilayah, selectedDate, formatDateShort, loading }) {
  // Default values yang aman
  const safeStatistik = statistik || {
    total_pegawai: 0,
    total_laporan: 0,
    total_panjang_kr: 0,
    total_panjang_kn: 0,
    avg_panjang_kr: 0,
    avg_panjang_kn: 0,
    // Untuk kompatibilitas dengan kedua format
    totalPekerja: 0,
    totalLaporan: 0,
    totalKR: 0,
    totalKN: 0,
    rataKR: 0,
    rataKN: 0
  };

  // Mendukung kedua format properti (snake_case dari API dan camelCase dari hook lama)
  const totalPekerja = safeStatistik.total_pegawai || safeStatistik.totalPekerja || 0;
  const totalLaporan = safeStatistik.total_laporan || safeStatistik.totalLaporan || 0;
  const totalKR = safeStatistik.total_panjang_kr || safeStatistik.totalKR || 0;
  const totalKN = safeStatistik.total_panjang_kn || safeStatistik.totalKN || 0;
  const rataKR = safeStatistik.avg_panjang_kr || safeStatistik.rataKR || 0;
  const rataKN = safeStatistik.avg_panjang_kn || safeStatistik.rataKN || 0;

  const cards = [
    {
      title: "Total Pekerja",
      value: totalPekerja,
      subtitle: selectedDate ? `Tanggal: ${formatDateShort(selectedDate)}` : 'Semua Periode',
      icon: Users,
      gradient: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Laporan",
      value: totalLaporan,
      subtitle: selectedWilayah || 'Semua Wilayah',
      icon: FileText,
      gradient: "from-green-50 to-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      title: "Total Panjang KR",
      value: `${typeof totalKR === 'number' ? totalKR.toFixed(2) : 0} m`,
      subtitle: `Rata: ${typeof rataKR === 'number' ? rataKR.toFixed(2) : 0} m`,
      icon: Ruler,
      gradient: "from-amber-50 to-orange-50",
      iconColor: "text-amber-600"
    },
    {
      title: "Total Panjang KN",
      value: `${typeof totalKN === 'number' ? totalKN.toFixed(2) : 0} m`,
      subtitle: `Rata: ${typeof rataKN === 'number' ? rataKN.toFixed(2) : 0} m`,
      icon: Ruler,
      gradient: "from-purple-50 to-violet-50",
      iconColor: "text-purple-600"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, gradient, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{value}</p>
          <p className="text-xs text-gray-400 mt-1 truncate" title={subtitle}>
            {subtitle}
          </p>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}