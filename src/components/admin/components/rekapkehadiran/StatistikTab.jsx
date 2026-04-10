"use client";

import { CalendarDays, ArrowLeft, PieChart, FileBarChart2, Download } from "lucide-react";
import { StatCards } from "./StatCards";
import { DistributionChart } from "./DistributionChart";
import { SummaryStats } from "./SummaryStats";

export function StatistikTab({
  statistikBulanan,
  bulanFilter,
  tahunFilter,
  wilayahFilter,
  getBulanLabel,
  getDaysInMonth,
  onBackToRekap,
  onExport
}) {
  return (
    <div className="space-y-6">
      {/* Informasi Periode */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <div className="min-w-0">
              <span className="text-sm font-medium text-blue-700 truncate">
                Statistik Bulan: {bulanFilter && tahunFilter ? 
                  `${getBulanLabel(bulanFilter)} ${tahunFilter}` : 
                  'Pilih Bulan'
                }
              </span>
              <p className="text-xs text-blue-600 mt-1 truncate">
                {wilayahFilter ? `Wilayah: ${wilayahFilter}` : 'Semua Wilayah'}
              </p>
            </div>
          </div>
          <button
            onClick={onBackToRekap}
            className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1 whitespace-nowrap"
          >
            <ArrowLeft size={12} />
            <span className="hidden md:inline">Kembali ke Rekap</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <StatCards statistik={statistikBulanan} />

      {/* Detail Statistik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <DistributionChart statistik={statistikBulanan} />
        <SummaryStats 
          statistik={statistikBulanan}
          bulanFilter={bulanFilter}
          tahunFilter={tahunFilter}
          getBulanLabel={getBulanLabel}
          getDaysInMonth={getDaysInMonth}
          onExport={onExport}
        />
      </div>
    </div>
  );
}