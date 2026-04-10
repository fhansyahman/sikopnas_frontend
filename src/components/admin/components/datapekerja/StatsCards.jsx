"use client";

import { Users, UserCheck, UserX } from "lucide-react";

export function StatsCards({ totalUsers, activeUsers, inactiveUsers }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        title="Total Karyawan"
        value={totalUsers}
        icon={<Users className="w-6 h-6 text-blue-600" />}
        gradient="from-cyan-50 to-blue-50"
      />
      <StatCard
        title="Status Aktif"
        value={activeUsers}
        icon={<UserCheck className="w-6 h-6 text-green-600" />}
        gradient="from-green-50 to-emerald-50"
        valueColor="text-green-600"
      />
      <StatCard
        title="Status Nonaktif"
        value={inactiveUsers}
        icon={<UserX className="w-6 h-6 text-red-600" />}
        gradient="from-red-50 to-pink-50"
        valueColor="text-red-600"
      />
    </div>
  );
}

function StatCard({ title, value, icon, gradient, valueColor = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}