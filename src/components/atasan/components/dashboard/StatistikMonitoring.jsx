import { Users, Clock, FileText, AlertTriangle } from "lucide-react";

export function StatistikMonitoring({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    { label: 'Total Pegawai', value: stats.totalPegawai, icon: Users, color: 'blue' },
    { label: 'Belum Absen', value: stats.belumAbsen, icon: Clock, color: 'yellow' },
    { label: 'Izin', value: stats.izin, icon: FileText, color: 'purple' },
    { label: 'Belum Lapor', value: stats.belumLapor, icon: AlertTriangle, color: 'red' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };

  const iconColors = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={`rounded-xl border p-4 ${colorClasses[stat.color]}`}>
            <div className="flex items-center">
              <Icon className={`h-5 w-5 mr-3 ${iconColors[stat.color]}`} />
              <div>
                <span className="text-sm opacity-80">{stat.label}</span>
                <p className="font-bold text-2xl">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}