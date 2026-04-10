"use client";

import { MapPin, UserCheck, UserX, TrendingUp } from "lucide-react";

export function StatisticsTab({ wilayahList, usersList, wilayahStats }) {
  const totalUsers = usersList.length;
  const wilayahWithUsers = Array.isArray(wilayahStats.wilayah_stats) 
    ? wilayahStats.wilayah_stats.filter(w => w.total_users > 0).length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Wilayah"
          value={wilayahList.length}
          icon={<MapPin className="w-6 h-6 text-blue-600" />}
          bg="from-blue-50 to-cyan-50"
        />
        <SummaryCard
          label="Total User Aktif"
          value={usersList.filter(u => u.is_active).length}
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          bg="from-green-50 to-emerald-50"
        />
        <SummaryCard
          label="Tanpa Wilayah"
          value={wilayahStats.no_wilayah_total || 0}
          icon={<UserX className="w-6 h-6 text-amber-600" />}
          bg="from-amber-50 to-orange-50"
        />
        <SummaryCard
          label="Wilayah Terisi"
          value={wilayahWithUsers}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          bg="from-purple-50 to-pink-50"
        />
      </div>

      {/* Detail Statistik */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Distribusi User per Wilayah</h3>
          <p className="text-sm text-gray-500 mt-1">Statistik penugasan wilayah pada sistem</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase">Wilayah</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase">Total User</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase">User Aktif</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase">Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(wilayahStats.wilayah_stats) && wilayahStats.wilayah_stats.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{item.nama_wilayah}</td>
                  <td className="py-4 px-6 text-blue-600 font-semibold">{item.total_users}</td>
                  <td className="py-4 px-6 text-green-600 font-semibold">{item.active_users}</td>
                  <td className="py-4 px-6">
                    <ProgressBar 
                      value={item.total_users} 
                      total={totalUsers}
                      color="blue"
                    />
                  </td>
                </tr>
              ))}
              
              {/* Row untuk user tanpa wilayah */}
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-red-600">Tanpa Wilayah</td>
                <td className="py-4 px-6 text-red-600 font-semibold">{wilayahStats.no_wilayah_total || 0}</td>
                <td className="py-4 px-6">-</td>
                <td className="py-4 px-6">
                  <ProgressBar 
                    value={wilayahStats.no_wilayah_total || 0} 
                    total={totalUsers}
                    color="red"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, bg }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${bg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colorClass = color === 'blue' ? 'bg-blue-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${colorClass} h-2 rounded-full`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="text-xs font-medium text-gray-600 w-12 text-right">
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
}