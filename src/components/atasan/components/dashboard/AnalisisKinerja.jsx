"use client";

import { ActivitySquare, CheckCircle2, AlertCircle, XCircle, FileQuestion, TrendingUp, TrendingDown, Target } from "lucide-react";
import { formatNumber } from "../../utils/dashboard/formatters";

export function AnalisisKinerja({ statistik, chartData }) {
  const totalPencapaianKR = statistik.rata_pencapaian_kr || 0;
  const totalPencapaianKN = statistik.rata_pencapaian_kn || 0;
  const totalKRAchieved = chartData?.totalKRAchieved || 0;
  const totalKNAchieved = chartData?.totalKNAchieved || 0;
  const totalKRTarget = chartData?.totalKRTarget || 0;
  const totalKNTarget = chartData?.totalKNTarget || 0;
  const totalAchieved = totalKRAchieved + totalKNAchieved;
  const totalTarget = totalKRTarget + totalKNTarget;
  const totalPercentage = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-emerald-600';
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
        <ActivitySquare size={20} />
        Analisis Performa Bulanan
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Rata-rata Pencapaian KR</p>
          <p className={`text-2xl font-bold ${getStatusColor(totalPencapaianKR)}`}>
            {totalPencapaianKR.toFixed(1)}%
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Target: 100%</span>
              <span className="text-gray-600">Per Pegawai</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  totalPencapaianKR >= 100 ? 'bg-emerald-500' :
                  totalPencapaianKR >= 80 ? 'bg-green-500' :
                  totalPencapaianKR >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                } transition-all duration-500`}
                style={{ width: `${Math.min(totalPencapaianKR, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">Rata-rata Pencapaian KN</p>
          <p className={`text-2xl font-bold ${getStatusColor(totalPencapaianKN)}`}>
            {totalPencapaianKN.toFixed(1)}%
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Target: 100%</span>
              <span className="text-gray-600">Per Pegawai</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  totalPencapaianKN >= 100 ? 'bg-emerald-500' :
                  totalPencapaianKN >= 80 ? 'bg-green-500' :
                  totalPencapaianKN >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                } transition-all duration-500`}
                style={{ width: `${Math.min(totalPencapaianKN, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">Rata-rata Harian</p>
          <p className="text-xl font-bold text-blue-600">
            {statistik.rata_kr?.toFixed(1) || 0}m KR + {statistik.rata_kn?.toFixed(1) || 0}m KN
          </p>
          <p className="text-xs text-gray-500 mt-1">Per pegawai per hari</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Target harian: 50m KR + 50m KN</span>
              <span className="text-gray-600">
                {(((statistik.rata_kr + statistik.rata_kn) / 100) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Kinerja Bulanan</p>
          <p className="text-2xl font-bold text-cyan-600">
            {formatNumber(totalAchieved)}m
          </p>
          <p className="text-xs text-gray-500 mt-1">KR + KN seluruh pegawai</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Target: {formatNumber(totalTarget)}m</span>
              <span className="text-gray-600">
                {totalPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  totalPercentage >= 100 ? 'bg-emerald-500' :
                  totalPercentage >= 80 ? 'bg-green-500' :
                  totalPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                } transition-all duration-500`}
                style={{ width: `${Math.min(totalPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {chartData?.statusCounts && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(chartData.statusCounts).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className={`px-4 py-3 rounded-lg border ${getStatusColorKinerja(status)}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  {getStatusIconKinerja(status)}
                  <p className="text-sm font-medium">{getStatusLabelKinerja(status)}</p>
                </div>
                <p className="text-2xl font-bold mt-1">{count}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {chartData.totalPegawai > 0 ? Math.round((count / chartData.totalPegawai) * 100) : 0}% dari total
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Re-export helpers
const getStatusLabelKinerja = (status) => {
  switch (status) {
    case 'tercapai_target': return 'Tercapai Target';
    case 'hampir_tercapai': return 'Hampir Tercapai';
    case 'sedang': return 'Sedang';
    case 'tidak_tercapai': return 'Tidak Tercapai';
    case 'tidak_ada_laporan': return 'Tidak Ada Laporan';
    default: return status;
  }
};

const getStatusColorKinerja = (status) => {
  switch (status) {
    case 'tercapai_target': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'hampir_tercapai': return 'bg-green-100 text-green-800 border-green-200';
    case 'sedang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'tidak_tercapai': return 'bg-red-100 text-red-800 border-red-200';
    case 'tidak_ada_laporan': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIconKinerja = (status) => {
  switch (status) {
    case 'tercapai_target':
      return <CheckCircle2 size={14} className="text-emerald-600" />;
    case 'hampir_tercapai':
      return <CheckCircle2 size={14} className="text-green-600" />;
    case 'sedang':
      return <AlertCircle size={14} className="text-yellow-600" />;
    case 'tidak_tercapai':
      return <XCircle size={14} className="text-red-600" />;
    case 'tidak_ada_laporan':
      return <FileQuestion size={14} className="text-gray-600" />;
    default:
      return <FileQuestion size={14} className="text-gray-600" />;
  }
};