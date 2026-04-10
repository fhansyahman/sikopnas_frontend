"use client";

import { 
  Clock3, CheckCircle, Ban, Calendar, Activity, UserCheck, 
  Users, ClipboardList, Briefcase, Truck 
} from "lucide-react";

export function StatusBadge({ status }) {
  const config = {
    'Pending': { 
      color: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-amber-200', 
      icon: <Clock3 size={14} />,
      textColor: 'text-amber-700'
    },
    'Disetujui': { 
      color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-200',
      icon: <CheckCircle size={14} />,
      textColor: 'text-emerald-700'
    },
    'Ditolak': { 
      color: 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-800 border border-rose-200',
      icon: <Ban size={14} />,
      textColor: 'text-rose-700'
    }
  };

  const cfg = config[status] || config['Pending'];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.icon}
      <span className={cfg.textColor}>{status}</span>
    </span>
  );
}

export function JenisBadge({ jenis }) {
  const config = {
    'Sakit': { 
      color: 'bg-gradient-to-r from-orange-50 to-amber-50 text-amber-700 border border-amber-200',
      icon: <Activity size={12} />,
      label: 'Sakit'
    },
    'Izin': { 
      color: 'bg-gradient-to-r from-purple-50 to-violet-50 text-violet-700 border border-violet-200',
      icon: <UserCheck size={12} />,
      label: 'Izin'
    },
    'Dinas Luar': { 
      color: 'bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 border border-blue-200',
      icon: <Briefcase size={12} />,
      label: 'Dinas Luar'
    }
  };

  const cfg = config[jenis] || {
    color: 'bg-gradient-to-r from-gray-50 to-slate-50 text-slate-700 border border-slate-200',
    icon: <ClipboardList size={12} />,
    label: jenis
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}