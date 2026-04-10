"use client";

import { MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { getWilayahColor } from "../../utils/dashboard/constants";
import { formatNumber } from "../../utils/dashboard/formatters";

export function TabelWilayahPresensi({ wilayahStatistik, statistik }) {
  const getStatusColor = (persenKehadiran) => {
    if (persenKehadiran >= 90) return 'bg-emerald-100 text-emerald-800';
    if (persenKehadiran >= 80) return 'bg-green-100 text-green-800';
    if (persenKehadiran >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (persenKehadiran) => {
    if (persenKehadiran >= 90) return 'Sangat Baik';
    if (persenKehadiran >= 80) return 'Baik';
    if (persenKehadiran >= 70) return 'Cukup';
    return 'Perlu Perhatian';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-8">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Statistik Detail per Wilayah</h3>
        <p className="text-sm text-gray-600">Analisis presensi berdasarkan wilayah kerja</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Wilayah</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Hadir</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Terlambat</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Izin</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanpa Keterangan</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tingkat Kehadiran</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.keys(wilayahStatistik)
              .filter(wilayah => {
                const stats = wilayahStatistik[wilayah];
                return (stats.totalHadir + stats.totalTerlambat + stats.totalIzin + stats.totalTanpaKeterangan) > 0;
              })
              .map(wilayah => {
                const stats = wilayahStatistik[wilayah];
                const total = stats.totalHadir + stats.totalTerlambat + stats.totalIzin + stats.totalTanpaKeterangan;
                const persenKehadiran = stats.persenHadir + stats.persenTerlambat;
                
                return (
                  <tr key={wilayah} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getWilayahColor(wilayah) }}></div>
                        <span className="font-medium text-gray-900">{wilayah}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-600">{stats.totalHadir}</span>
                      <span className="text-xs text-gray-500 ml-1">({stats.persenHadir}%)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-amber-600">{stats.totalTerlambat}</span>
                      <span className="text-xs text-gray-500 ml-1">({stats.persenTerlambat}%)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-purple-600">{stats.totalIzin}</span>
                      <span className="text-xs text-gray-500 ml-1">({stats.persenIzin}%)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-red-600">{stats.totalTanpaKeterangan}</span>
                      <span className="text-xs text-gray-500 ml-1">({stats.persenTanpaKeterangan}%)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900">{total}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{persenKehadiran}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              persenKehadiran >= 90 ? 'bg-emerald-500' :
                              persenKehadiran >= 80 ? 'bg-green-500' :
                              persenKehadiran >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(persenKehadiran, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium w-fit ${getStatusColor(persenKehadiran)}`}>
                        {getStatusText(persenKehadiran)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            
            {/* Total Row */}
            <tr className="bg-gray-50 font-bold text-black">
              <td className="py-3 px-4">TOTAL</td>
              <td className="py-3 px-4 text-emerald-600">{statistik.totalHadir}</td>
              <td className="py-3 px-4 text-amber-600">{statistik.totalTerlambat}</td>
              <td className="py-3 px-4 text-purple-600">{statistik.totalIzin}</td>
              <td className="py-3 px-4 text-red-600">{statistik.totalTanpaKeterangan}</td>
              <td className="py-3 px-4">{statistik.totalHadir + statistik.totalTerlambat + statistik.totalIzin + statistik.totalTanpaKeterangan}</td>
              <td className="py-3 px-4">
                <span className="font-bold text-blue-600">{statistik.persenHadir + statistik.persenTerlambat}%</span>
              </td>
              <td className="py-3 px-4">
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium w-fit ${
                  (statistik.persenHadir + statistik.persenTerlambat) >= 90 ? 'bg-emerald-100 text-emerald-800' :
                  (statistik.persenHadir + statistik.persenTerlambat) >= 80 ? 'bg-green-100 text-green-800' :
                  (statistik.persenHadir + statistik.persenTerlambat) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {(statistik.persenHadir + statistik.persenTerlambat) >= 90 ? 'Sangat Baik' :
                   (statistik.persenHadir + statistik.persenTerlambat) >= 80 ? 'Baik' :
                   (statistik.persenHadir + statistik.persenTerlambat) >= 70 ? 'Cukup' : 'Perlu Perhatian'}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}