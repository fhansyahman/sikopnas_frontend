"use client";

import { ClipboardList, Calendar, Activity, UserCheck } from "lucide-react";

export function JenisIzinList({ statistik, izinList }) {
  const jenisItems = [
    { 
      label: "Cuti Tahunan", 
      value: statistik.cuti_tahunan || 0, 
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      color: "from-blue-50 to-sky-50",
      iconBg: "border-blue-200"
    },
    { 
      label: "Cuti Sakit", 
      value: statistik.cuti_sakit || 0, 
      icon: <Activity className="w-5 h-5 text-orange-600" />,
      color: "from-orange-50 to-amber-50",
      iconBg: "border-orange-200"
    },
    { 
      label: "Izin Pribadi", 
      value: statistik.izin_pribadi || 0, 
      icon: <UserCheck className="w-5 h-5 text-purple-600" />,
      color: "from-purple-50 to-violet-50",
      iconBg: "border-purple-200"
    }
  ];

  const otherCount = izinList.filter(i => 
    !['Cuti Tahunan', 'Cuti Sakit', 'Izin Pribadi'].includes(i.jenis)
  ).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ClipboardList size={20} className="text-blue-500" />
          Jenis Izin Terpopuler
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Distribusi berdasarkan jenis izin
        </p>
      </div>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {jenisItems.map((item, index) => (
          <JenisItem key={index} {...item} total={statistik.total_pengajuan} />
        ))}
        
        {otherCount > 0 && (
          <div className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {otherCount} pengajuan dengan jenis lainnya
            </p>
          </div>
        )}
      </div>
      
      <Legend />
    </div>
  );
}

function JenisItem({ label, value, icon, color, iconBg, total }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${color} rounded-lg hover:from-opacity-80 transition-colors`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 bg-white rounded-lg border ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <span className="font-medium text-gray-900">{label}</span>
          <p className="text-xs text-gray-500">{value} pengajuan</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-blue-600">{percentage}%</div>
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { color: "bg-emerald-500", label: "Disetujui" },
    { color: "bg-rose-500", label: "Ditolak" },
    { color: "bg-amber-500", label: "Pending" },
    { color: "bg-blue-500", label: "Cuti Tahunan" }
  ];

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}