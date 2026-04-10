"use client";

import { CalendarDays, FileText, Users, Ruler, BarChart3, MapPin, Building } from "lucide-react";
import { StatistikWilayah } from "./StatistikWilayah";

export function StatistikTab({
  statistik = {},
  kinerjaList = [],
  selectedDate,
  tanggalInfo,
  onResetFilters
}) {
  // Default values dengan safe access
  const safeStatistik = {
    total_laporan: statistik?.total_laporan || 0,
    total_pegawai: statistik?.total_pegawai || 0,
    total_panjang_kr: statistik?.total_panjang_kr || 0,
    total_panjang_kn: statistik?.total_panjang_kn || 0,
    avg_panjang_kr: statistik?.avg_panjang_kr || 0,
    avg_panjang_kn: statistik?.avg_panjang_kn || 0,
    wilayah: statistik?.wilayah || {}
  };

  // Format tanggal untuk display
  const formatDateRange = () => {
    if (tanggalInfo?.tanggal_formatted) {
      return tanggalInfo.tanggal_formatted;
    }
    if (selectedDate) {
      try {
        return new Date(selectedDate).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch {
        return selectedDate;
      }
    }
    return '-';
  };

  const summaryCards = [
    {
      title: "Total Laporan",
      value: safeStatistik.total_laporan,
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      bgColor: "from-blue-50 to-cyan-50",
      textColor: "text-blue-600"
    },
    {
      title: "Total Pegawai",
      value: safeStatistik.total_pegawai,
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Rata-rata KR",
      value: `${safeStatistik.avg_panjang_kr} m`,
      icon: <Ruler className="w-5 h-5 text-amber-600" />,
      bgColor: "from-amber-50 to-orange-50",
      textColor: "text-amber-600"
    },
    {
      title: "Rata-rata KN",
      value: `${safeStatistik.avg_panjang_kn} m`,
      icon: <Ruler className="w-5 h-5 text-purple-600" />,
      bgColor: "from-purple-50 to-violet-50",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Informasi Periode */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Periode Statistik: {formatDateRange()}
            </span>
            {tanggalInfo?.hari && (
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                {tanggalInfo.hari}
              </span>
            )}
          </div>
          <button
            onClick={onResetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Kembali ke hari ini
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Detail Statistik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Distribusi per Wilayah */}
        <DistribusiWilayah
          statistik={safeStatistik}
          selectedDate={selectedDate}
          tanggalInfo={tanggalInfo}
        />

        {/* Detail per Wilayah */}
        <StatistikWilayah
          statistik={safeStatistik}
          kinerjaList={kinerjaList}
        />
      </div>

      {/* Total Data Info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <p className="text-sm text-gray-600">Total Data Kinerja</p>
            <p className="text-2xl font-bold text-gray-800">{safeStatistik.total_laporan} record</p>
            <p className="text-xs text-gray-500">Periode: {formatDateRange()}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Pegawai</p>
              <p className="text-lg font-semibold">{safeStatistik.total_pegawai}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Total KR</p>
              <p className="text-lg font-semibold text-amber-600">{safeStatistik.total_panjang_kr} m</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Total KN</p>
              <p className="text-lg font-semibold text-purple-600">{safeStatistik.total_panjang_kn} m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, bgColor, textColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DistribusiWilayah({ statistik, selectedDate, tanggalInfo }) {
  const hasData = statistik.wilayah && Object.keys(statistik.wilayah).length > 0;
  
  // Konversi data wilayah ke array untuk ditampilkan
  const wilayahList = hasData 
    ? Object.entries(statistik.wilayah).map(([nama, data]) => ({
        nama,
        total: data.total || 0,
        total_kr: data.total_kr || 0,
        total_kn: data.total_kn || 0,
        avg_kr: data.avg_kr || 0,
        avg_kn: data.avg_kn || 0,
        total_pegawai: data.total_pegawai || 0
      }))
    : [];

  const totalLaporan = statistik.total_laporan || 0;

  const formatDate = () => {
    if (tanggalInfo?.tanggal_formatted) {
      return tanggalInfo.tanggal_formatted;
    }
    if (selectedDate) {
      try {
        return new Date(selectedDate).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch {
        return selectedDate;
      }
    }
    return 'Semua waktu';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-500" />
          Distribusi Laporan per Wilayah
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Statistik laporan berdasarkan wilayah untuk tanggal {formatDate()}
        </p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        {hasData && wilayahList.length > 0 ? (
          wilayahList.map((wilayah) => (
            <WilayahProgress
              key={wilayah.nama}
              wilayah={wilayah.nama}
              data={wilayah}
              total={totalLaporan}
            />
          ))
        ) : (
          <EmptyStatistik />
        )}
      </div>
      
      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Data Kinerja</p>
            <p className="text-lg font-bold text-gray-900">{totalLaporan} record</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Periode</p>
            <p className="text-sm font-medium text-gray-900">{formatDate()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WilayahProgress({ wilayah, data, total }) {
  const persen = total > 0 ? Math.round((data.total / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium text-gray-700 truncate">{wilayah}</span>
        </div>
        <div className="text-right">
          <span className="font-semibold text-blue-600">{persen}%</span>
          <p className="text-xs text-gray-400">{data.total} laporan</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
          style={{ width: `${persen}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1">
          <Ruler size={10} />
          <span className="truncate">KR: {data.total_kr?.toFixed(1) || 0}m</span>
        </div>
        <div className="flex items-center gap-1">
          <Ruler size={10} />
          <span className="truncate">KN: {data.total_kn?.toFixed(1) || 0}m</span>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-400">
        Rata-rata KR: {data.avg_kr?.toFixed(1) || 0}m | KN: {data.avg_kn?.toFixed(1) || 0}m
      </div>
    </div>
  );
}

function EmptyStatistik() {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
        <BarChart3 className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500">Tidak ada data statistik untuk tanggal ini</p>
      <p className="text-xs text-gray-400 mt-1">Coba pilih tanggal lain</p>
    </div>
  );
}