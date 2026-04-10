"use client";

import { MapPin, Building, Ruler, Users } from "lucide-react";

export function StatistikWilayah({ statistik = {}, kinerjaList = [] }) {
  const hasData = statistik.wilayah && Object.keys(statistik.wilayah).length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin size={20} className="text-blue-500" />
          Detail per Wilayah
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Rincian kinerja per wilayah
        </p>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {hasData ? (
          Object.entries(statistik.wilayah).map(([wilayah, data]) => (
            <WilayahDetailItem
              key={wilayah}
              wilayah={wilayah}
              data={data}
            />
          ))
        ) : (
          <EmptyWilayah />
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <LegendaWarna />
      </div>
    </div>
  );
}

function WilayahDetailItem({ wilayah, data }) {
  // Gunakan total_pegawai dari data (bukan pegawai)
  const jumlahPegawai = data.total_pegawai || 0;
  
  // Hitung rata-rata jika belum ada
  const avgKr = data.avg_kr || (data.total > 0 ? data.total_kr / data.total : 0);
  const avgKn = data.avg_kn || (data.total > 0 ? data.total_kn / data.total : 0);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Building className="w-5 h-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-medium text-gray-900 truncate block">{wilayah}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <Users size={12} className="text-gray-400" />
            <p className="text-xs text-gray-500">
              {jumlahPegawai} pegawai
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-right ml-4 flex-shrink-0">
        {/* Total Laporan */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-lg font-semibold text-blue-600">
            {data.total || 0}
          </span>
          <span className="text-xs text-gray-500">laporan</span>
        </div>
        
        {/* Total KR */}
        <div className="flex items-center justify-end gap-2 mt-1">
          <Ruler size={12} className="text-amber-500" />
          <span className="text-sm font-medium text-amber-600">
            {data.total_kr?.toFixed(1) || 0} m
          </span>
          <span className="text-xs text-gray-400">total KR</span>
        </div>
        
        {/* Rata-rata KR & KN */}
        <div className="flex items-center justify-end gap-2 mt-1">
          <span className="text-xs text-gray-500">
            Rata KR: {avgKr.toFixed(1)}m
          </span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">
            KN: {avgKn.toFixed(1)}m
          </span>
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
      <p className="text-xs text-gray-400 mt-1">Belum ada laporan kinerja</p>
    </div>
  );
}

function LegendaWarna() {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-gray-600 truncate">Total Laporan</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        <span className="text-gray-600 truncate">Total Pegawai</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
        <span className="text-gray-600 truncate">Total Panjang KR</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
        <span className="text-gray-600 truncate">Total Panjang KN</span>
      </div>
    </div>
  );
}