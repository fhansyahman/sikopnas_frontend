"use client";

import { Users, CheckCircle2, Target, CalendarDays } from "lucide-react";
import { formatNumber } from "../../utils/formatters";

export function StatistikKinerja({ statistik, chartData, selectedMonth, selectedYear }) {
  const getNamaBulan = (month) => {
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return bulan[parseInt(month) - 1] || '';
  };

  const stats = [
    {
      label: 'Total Pegawai Aktif',
      value: statistik.total_pegawai || 0,
      subtext: `${statistik.hari_kerja || 0} hari kerja`,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Sudah Lapor',
      value: statistik.total_sudah_lapor || 0,
      subtext: `${statistik.persen_sudah_lapor || 0}% dari total`,
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      label: 'Tercapai Target',
      value: statistik.total_tercapai_target || 0,
      subtext: `${statistik.persen_tercapai_target || 0}% dari yang lapor`,
      icon: Target,
      color: 'purple'
    },
    {
      label: 'Periode',
      value: chartData?.bulan || (selectedMonth && selectedYear ? `${getNamaBulan(selectedMonth)} ${selectedYear}` : 'Pilih Periode'),
      subtext: `Target: ${formatNumber(statistik.target_kr_bulanan || 0)}m KR + ${formatNumber(statistik.target_kn_bulanan || 0)}m KN`,
      icon: CalendarDays,
      color: 'amber'
    }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-600' }
  };

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color];
        
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}