"use client";

import { Check, Clock, X, FileCheck } from "lucide-react";

const statusConfig = {
  'Izin': { color: 'bg-purple-100 text-purple-800', icon: FileCheck },
  'Tepat Waktu': { color: 'bg-green-100 text-green-800', icon: Check },
  'Terlambat': { color: 'bg-amber-100 text-amber-800', icon: Clock },
  'Tanpa Keterangan': { color: 'bg-gray-100 text-gray-800', icon: X },
  'Cepat Pulang': { color: 'bg-orange-100 text-orange-800', icon: Clock },
  'Belum Pulang': { color: 'bg-blue-100 text-blue-800', icon: Clock },
  'Lembur': { color: 'bg-indigo-100 text-indigo-800', icon: Clock }
};

export function StatusBadge({ status, izinId = null }) {
  if (izinId) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800`}>
        <FileCheck size={12} />
        Izin
      </span>
    );
  }

  const config = statusConfig[status] || statusConfig['Tanpa Keterangan'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}