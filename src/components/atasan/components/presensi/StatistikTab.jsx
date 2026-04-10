"use client";

import { 
  CalendarDays, BarChart3, MapPin, Building, Clipboard,
  Users, CheckCircle, Clock, FileCheck, RefreshCw
} from "lucide-react";
import Swal from "sweetalert2";

export function StatistikTab({ statistik, presensiList, tanggalFilter, onResetDate }) {
  
  const handleCopyStats = () => {
    const statsToExport = {
      total_pegawai: statistik.total_pegawai,
      hadir: statistik.total_hadir,
      terlambat: statistik.total_terlambat,
      izin: statistik.total_izin,
      tanpa_keterangan: statistik.total_tanpa_keterangan,
      lembur: statistik.total_lembur,
      persentase_hadir: `${statistik.persen_hadir}%`,
      persentase_terlambat: `${statistik.persen_terlambat}%`,
      persentase_izin: `${statistik.persen_izin}%`,
      persentase_tanpa_keterangan: `${statistik.persen_tanpa_keterangan}%`,
      tanggal: tanggalFilter || new Date().toLocaleDateString('id-ID'),
      wilayah_data: statistik.wilayah
    };
    
    navigator.clipboard.writeText(JSON.stringify(statsToExport, null, 2));
    
    Swal.fire({
      title: 'Statistik Siap di-Copy',
      text: 'Data statistik telah disalin ke clipboard',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#10B981',
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Periode */}
      <PeriodeInfo 
        tanggalFilter={tanggalFilter} 
        onResetDate={onResetDate} 
      />

      {/* Summary Cards */}
      <SummaryCards statistik={statistik} />

      {/* Detail Statistik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistribusiChart statistik={statistik} />
        <WilayahStats statistik={statistik} />
      </div>

      {/* Action Buttons */}
      <ActionBar 
        onReset={onResetDate}
        onCopy={handleCopyStats}
      />
    </div>
  );
}

function PeriodeInfo({ tanggalFilter, onResetDate }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Periode Statistik: {tanggalFilter ? tanggalFilter : 'Hari ini'}
          </span>
        </div>
        <button
          onClick={onResetDate}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Kembali ke hari ini
        </button>
      </div>
    </div>
  );
}

function SummaryCards({ statistik }) {
  const cards = [
    {
      title: "Total Pegawai",
      value: statistik.total_pegawai || 0,
      subtitle: "Terdaftar",
      icon: Users,
      color: "text-blue-600",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      title: "Hadir",
      value: statistik.total_hadir || 0,
      percentage: statistik.persen_hadir,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      title: "Terlambat",
      value: statistik.total_terlambat || 0,
      percentage: statistik.persen_terlambat,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "from-amber-50 to-orange-50"
    },
    {
      title: "Izin",
      value: statistik.total_izin || 0,
      percentage: statistik.persen_izin,
      icon: FileCheck,
      color: "text-purple-600",
      bgColor: "from-purple-50 to-pink-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              {card.subtitle && <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>}
              {card.percentage !== undefined && (
                <p className="text-sm text-gray-600 mt-1">{card.percentage}%</p>
              )}
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${card.bgColor} rounded-xl flex items-center justify-center`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DistribusiChart({ statistik }) {
  const items = [
    { label: "Hadir", value: statistik.persen_hadir, count: statistik.total_hadir, color: "bg-green-500" },
    { label: "Terlambat", value: statistik.persen_terlambat, count: statistik.total_terlambat, color: "bg-amber-500" },
    { label: "Izin", value: statistik.persen_izin, count: statistik.total_izin, color: "bg-purple-500" },
    { label: "Tanpa Keterangan", value: statistik.persen_tanpa_keterangan, count: statistik.total_tanpa_keterangan, color: "bg-red-500" }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-500" />
          Distribusi Kehadiran
        </h3>
      </div>
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <ProgressBar key={index} {...item} />
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Data Presensi</p>
            <p className="text-lg font-bold text-gray-900">{statistik.total_pegawai || 0} record</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, count, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <span className="text-sm text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className="font-semibold" style={{ color: color.replace('bg-', 'text-') }}>{value || 0}%</span>
          <p className="text-xs text-gray-400">{count || 0} orang</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-500`} 
          style={{ width: `${value || 0}%` }}
        />
      </div>
    </div>
  );
}

function WilayahStats({ statistik }) {
  const wilayah = statistik.wilayah || {};

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin size={20} className="text-blue-500" />
          Rekap per Wilayah
        </h3>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {Object.keys(wilayah).length > 0 ? (
          Object.entries(wilayah).map(([wilayahName, data]) => (
            <WilayahItem 
              key={wilayahName}
              nama={wilayahName}
              data={data}
            />
          ))
        ) : (
          <EmptyWilayah />
        )}
      </div>
      
      <LegendWilayah />
    </div>
  );
}

function WilayahItem({ nama, data }) {
  const persenHadir = data.total > 0 ? Math.round((data.hadir / data.total) * 100) : 0;
  const persenIzin = data.total > 0 ? Math.round((data.izin / data.total) * 100) : 0;
  const persenTanpaKeterangan = data.total > 0 ? Math.round((data.tanpa_keterangan / data.total) * 100) : 0;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Building className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <span className="font-medium text-gray-900">{nama}</span>
          <p className="text-xs text-gray-500">{data.total} pegawai</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-end gap-2">
            <span className="text-lg font-semibold text-green-600">{data.hadir}</span>
            <span className="text-xs text-gray-500">hadir</span>
          </div>
          <p className="text-xs text-gray-500">
            {persenHadir}% hadir
            {persenIzin > 0 && ` • ${persenIzin}% izin`}
            {persenTanpaKeterangan > 0 && ` • ${persenTanpaKeterangan}% tanpa keterangan`}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyWilayah() {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
        <MapPin className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500">Tidak ada data wilayah</p>
    </div>
  );
}

function LegendWilayah() {
  const legends = [
    { color: "bg-green-500", label: "Hadir" },
    { color: "bg-amber-500", label: "Terlambat" },
    { color: "bg-purple-500", label: "Izin" },
    { color: "bg-red-500", label: "Tanpa Keterangan" }
  ];

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {legends.map((legend, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${legend.color}`}></div>
            <span className="text-gray-600">{legend.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBar({ onReset, onCopy }) {
  return (
    <div className="flex justify-end gap-3">
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-3 bg-gray-200 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium shadow-sm"
      >
        <RefreshCw size={16} />
        Reset ke Hari Ini
      </button>
      <button
        onClick={onCopy}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 text-sm font-medium shadow-sm"
      >
        <Clipboard size={16} />
        Copy Statistik
      </button>
    </div>
  );
}