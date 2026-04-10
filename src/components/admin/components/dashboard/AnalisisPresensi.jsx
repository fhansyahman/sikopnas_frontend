"use client";

import { TrendingUp, AlertCircle, CheckCircle, AlertTriangle, Users, Clock, FileText, XCircle } from "lucide-react";

export function AnalisisPresensi({ statistik }) {
  const totalPresensi = statistik.totalHadir + statistik.totalTerlambat + statistik.totalIzin + statistik.totalTanpaKeterangan;
  const tingkatKehadiran = statistik.persenHadir + statistik.persenTerlambat;
  const tingkatKetidakhadiran = statistik.persenIzin + statistik.persenTanpaKeterangan;

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-emerald-600';
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (tingkatKehadiran < 80) {
      recommendations.push({
        icon: <AlertTriangle size={16} className="text-red-500" />,
        text: "Tingkat kehadiran di bawah 80%. Perlu evaluasi dan monitoring ketat untuk semua wilayah."
      });
    }
    
    if (statistik.persenTerlambat > 10) {
      recommendations.push({
        icon: <Clock size={16} className="text-orange-500" />,
        text: `Tingkat keterlambatan ${statistik.persenTerlambat}% cukup tinggi. Pertimbangkan sosialisasi jam masuk.`
      });
    }
    
    if (statistik.persenTanpaKeterangan > 5) {
      recommendations.push({
        icon: <XCircle size={16} className="text-red-500" />,
        text: `Tingkat tanpa keterangan ${statistik.persenTanpaKeterangan}% perlu ditindaklanjuti.`
      });
    }
    
    if (statistik.persenIzin > 10) {
      recommendations.push({
        icon: <FileText size={16} className="text-purple-500" />,
        text: `Tingkat izin ${statistik.persenIzin}% cukup tinggi. Perlu analisis lebih lanjut.`
      });
    }
    
    if (tingkatKehadiran >= 90) {
      recommendations.push({
        icon: <CheckCircle size={16} className="text-emerald-500" />,
        text: "Tingkat kehadiran sangat baik! Pertahankan performa ini."
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        icon: <CheckCircle size={16} className="text-green-500" />,
        text: "Semua indikator dalam batas normal. Terus pantau secara berkala."
      });
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
        <TrendingUp size={20} />
        Analisis Kehadiran
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insight Data */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-blue-600" />
            Insight Data
          </h4>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <span>
                <strong>Tingkat kehadiran:</strong> {statistik.persenHadir}% hadir tepat waktu
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <span>
                <strong>Keterlambatan:</strong> {statistik.persenTerlambat}% presensi terlambat
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <span>
                <strong>Ketidakhadiran:</strong> {tingkatKetidakhadiran}% tidak hadir (Izin + Tanpa Keterangan)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <span>
                <strong>Total data:</strong> {statistik.totalPegawai} pegawai dalam periode ini
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <span>
                <strong>Total presensi:</strong> {totalPresensi} data presensi
              </span>
            </li>
          </ul>
        </div>
        
        {/* Rekomendasi */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            Rekomendasi
          </h4>
          <ul className="space-y-3 text-sm text-gray-700">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">
                  {rec.icon}
                </div>
                <span>{rec.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Progress Bar Keseluruhan */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Tingkat Kehadiran Keseluruhan</span>
          <span className={`text-sm font-bold ${getStatusColor(tingkatKehadiran)}`}>
            {tingkatKehadiran}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              tingkatKehadiran >= 90 ? 'bg-emerald-500' :
              tingkatKehadiran >= 80 ? 'bg-green-500' :
              tingkatKehadiran >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            } transition-all duration-500`}
            style={{ width: `${Math.min(tingkatKehadiran, 100)}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <CheckCircle size={14} />
              <span className="text-xs">Hadir</span>
            </div>
            <p className="font-bold text-emerald-600">{statistik.persenHadir}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600">
              <Clock size={14} />
              <span className="text-xs">Terlambat</span>
            </div>
            <p className="font-bold text-amber-600">{statistik.persenTerlambat}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600">
              <FileText size={14} />
              <span className="text-xs">Izin</span>
            </div>
            <p className="font-bold text-purple-600">{statistik.persenIzin}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-600">
              <XCircle size={14} />
              <span className="text-xs">Tanpa Ket.</span>
            </div>
            <p className="font-bold text-red-600">{statistik.persenTanpaKeterangan}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}