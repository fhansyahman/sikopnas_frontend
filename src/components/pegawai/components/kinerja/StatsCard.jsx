"use client";

export function StatsCard({ stats, efficiency, totalLaporan }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Ringkasan Kinerja</h2>
        <div className="flex items-center mt-2">
          <div className="flex-1">
            <p className="text-2xl font-bold text-green-600">{efficiency}%</p>
            <p className="text-gray-600 text-sm">Tingkat Produktivitas</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Bulan Ini</p>
            <p className="font-semibold">{stats.total_laporan} laporan</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <StatItem
            color="bg-blue-500"
            value={stats.total_laporan}
            label="Total Laporan"
            textColor="text-blue-700"
            bgColor="bg-blue-50"
          />
          
          <StatItem
            color="bg-green-500"
            value={`${stats.total_panjang.toFixed(1)}m`}
            label="Total Panjang"
            textColor="text-green-700"
            bgColor="bg-green-50"
          />
          
          <StatItem
            color="bg-purple-500"
            value={`${stats.avg_panjang.toFixed(1)}m`}
            label="Rata-rata"
            textColor="text-purple-700"
            bgColor="bg-purple-50"
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ color, value, label, textColor, bgColor }) {
  return (
    <div className={`flex items-center space-x-3 p-2 ${bgColor} rounded-lg`}>
      <div className={`w-3 h-3 ${color} rounded-full`}></div>
      <div>
        <p className={`font-semibold ${textColor}`}>{value}</p>
        <p className={`text-xs ${textColor.replace('700', '600')}`}>{label}</p>
      </div>
    </div>
  );
}