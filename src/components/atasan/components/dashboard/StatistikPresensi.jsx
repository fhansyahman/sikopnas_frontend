import { Users, UserCheck, Clock, FileText, AlertCircle } from "lucide-react";
import { formatNumber } from "../../utils/dashboard/formatters";

export function StatistikPresensi({ statistik }) {
  const stats = [
    { label: 'Total Pegawai', value: statistik.totalPegawai, icon: Users, color: 'blue' },
    { label: 'Hadir', value: statistik.totalHadir, icon: UserCheck, color: 'emerald' },
    { label: 'Terlambat', value: statistik.totalTerlambat, icon: Clock, color: 'amber' },
    { label: 'Izin', value: statistik.totalIzin, icon: FileText, color: 'purple' },
    { label: 'Tanpa Keterangan', value: statistik.totalTanpaKeterangan, icon: AlertCircle, color: 'red' },
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
  };

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 text-black">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color];
        
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: stat.color === 'blue' ? '#2563EB' : undefined }}>
                  {formatNumber(stat.value)}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}