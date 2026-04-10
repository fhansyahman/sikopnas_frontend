"use client";

import { 
  CalendarDays, BarChart3, ClipboardList, Activity, 
  UserCheck, Briefcase, RefreshCw, Clipboard, FileText 
} from "lucide-react";
import Swal from "sweetalert2";

export function StatistikTab({ statistik, izinList, tanggalFilter, onResetToToday }) {
  const total = statistik.total_pengajuan || 0;

  // Hitung ulang statistik untuk jenis yang baru
  const sakitCount = izinList.filter(i => i.jenis === 'Sakit').length;
  const izinCount = izinList.filter(i => i.jenis === 'Izin').length;
  const dinasLuarCount = izinList.filter(i => i.jenis === 'Dinas Luar').length;

  const handleCopyStats = () => {
    const statsToExport = {
      total_pengajuan: statistik.total_pengajuan,
      pending: statistik.pending,
      disetujui: statistik.disetujui,
      ditolak: statistik.ditolak,
      sakit: sakitCount,
      izin: izinCount,
      dinas_luar: dinasLuarCount,
      persentase_disetujui: `${statistik.persen_disetujui}%`,
      persentase_ditolak: `${statistik.persen_ditolak}%`,
      persentase_pending: `${statistik.persen_pending}%`,
      tanggal: tanggalFilter || new Date().toLocaleDateString('id-ID'),
      wilayah_data: statistik.wilayah
    };
    
    Swal.fire({
      title: 'Statistik Siap di-Copy',
      html: `
        <div class="text-left">
          <p class="mb-2">Data statistik telah disalin ke clipboard</p>
          <pre class="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">${JSON.stringify(statsToExport, null, 2)}</pre>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#10B981',
    });
    
    navigator.clipboard.writeText(JSON.stringify(statsToExport, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Informasi Periode */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Periode Statistik: {tanggalFilter ? tanggalFilter : 'Hari ini'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Pengajuan"
          value={statistik.total_pengajuan || 0}
          icon={<CalendarDays className="w-6 h-6 text-blue-600" />}
          bgColor="from-blue-50 to-cyan-50"
          subtitle={tanggalFilter}
        />
        <SummaryCard
          title="Pending"
          value={statistik.pending || 0}
          percentage={statistik.persen_pending || 0}
          icon={<FileText className="w-6 h-6 text-amber-600" />}
          bgColor="from-amber-50 to-orange-50"
          textColor="text-amber-600"
        />
        <SummaryCard
          title="Disetujui"
          value={statistik.disetujui || 0}
          percentage={statistik.persen_disetujui || 0}
          icon={<Clipboard className="w-6 h-6 text-emerald-600" />}
          bgColor="from-green-50 to-emerald-50"
          textColor="text-emerald-600"
        />
        <SummaryCard
          title="Ditolak"
          value={statistik.ditolak || 0}
          percentage={statistik.persen_ditolak || 0}
          icon={<FileText className="w-6 h-6 text-rose-600" />}
          bgColor="from-red-50 to-rose-50"
          textColor="text-rose-600"
        />
      </div>

      {/* Detail Statistik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-500" />
              Distribusi Status Izin
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Statistik izin berdasarkan status {tanggalFilter && `pada ${tanggalFilter}`}
            </p>
          </div>
          
          <div className="space-y-6">
            <StatusProgress
              label="Disetujui"
              value={statistik.disetujui || 0}
              percentage={statistik.persen_disetujui || 0}
              color="emerald"
            />
            <StatusProgress
              label="Ditolak"
              value={statistik.ditolak || 0}
              percentage={statistik.persen_ditolak || 0}
              color="rose"
            />
            <StatusProgress
              label="Pending"
              value={statistik.pending || 0}
              percentage={statistik.persen_pending || 0}
              color="amber"
            />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Data Izin</p>
                <p className="text-lg font-bold text-gray-900">{izinList.length} record</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Periode</p>
                <p className="text-sm font-medium text-gray-900">
                  {tanggalFilter ? tanggalFilter : new Date().toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jenis Izin Terpopuler */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ClipboardList size={20} className="text-blue-500" />
              Jenis Izin
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Distribusi berdasarkan jenis izin {tanggalFilter && `pada ${tanggalFilter}`}
            </p>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <JenisItem
              icon={<Activity className="w-5 h-5 text-orange-600" />}
              label="Sakit"
              value={sakitCount}
              total={total}
              color="orange"
            />
            <JenisItem
              icon={<UserCheck className="w-5 h-5 text-purple-600" />}
              label="Izin"
              value={izinCount}
              total={total}
              color="purple"
            />
            <JenisItem
              icon={<Briefcase className="w-5 h-5 text-blue-600" />}
              label="Dinas Luar"
              value={dinasLuarCount}
              total={total}
              color="blue"
            />
            
            <div className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Total: {sakitCount + izinCount + dinasLuarCount} pengajuan
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <LegendItem color="bg-emerald-500" label="Disetujui" />
              <LegendItem color="bg-rose-500" label="Ditolak" />
              <LegendItem color="bg-amber-500" label="Pending" />
              <LegendItem color="bg-orange-500" label="Sakit" />
              <LegendItem color="bg-purple-500" label="Izin" />
              <LegendItem color="bg-blue-500" label="Dinas Luar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, percentage, icon, bgColor, textColor = "text-gray-800", subtitle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
          {percentage !== undefined && (
            <p className="text-sm text-gray-600 mt-1">{percentage}%</p>
          )}
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusProgress({ label, value, percentage, color }) {
  // Mapping warna untuk Tailwind
  const colorMap = {
    emerald: {
      bg: "bg-emerald-500",
      text: "text-emerald-600",
      progress: "bg-emerald-500"
    },
    rose: {
      bg: "bg-rose-500",
      text: "text-rose-600",
      progress: "bg-rose-500"
    },
    amber: {
      bg: "bg-amber-500",
      text: "text-amber-600",
      progress: "bg-amber-500"
    }
  };

  const colors = colorMap[color] || colorMap.emerald;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
          <span className="text-sm text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className={`font-semibold ${colors.text}`}>{percentage}%</span>
          <p className="text-xs text-gray-400">{value} pengajuan</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${colors.progress} h-3 rounded-full transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function JenisItem({ icon, label, value, total, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  // Mapping warna untuk Tailwind
  const colorMap = {
    orange: "orange",
    purple: "purple",
    blue: "blue"
  };

  const colorName = colorMap[color] || "blue";

  return (
    <div className={`flex items-center justify-between p-3 bg-gradient-to-r from-${colorName}-50 to-${colorName}-100/50 rounded-lg hover:from-${colorName}-100 hover:to-${colorName}-200 transition-colors`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 bg-white rounded-lg border border-${colorName}-200 flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <span className="font-medium text-gray-900">{label}</span>
          <p className="text-xs text-gray-500">{value} pengajuan</p>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-lg font-semibold text-${colorName}-600`}>{percentage}%</div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-gray-600">{label}</span>
    </div>
  );
}