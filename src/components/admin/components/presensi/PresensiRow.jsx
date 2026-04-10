"use client";

import { Camera, Eye, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function PresensiRow({ presensi, onViewDetail, onEdit, onDelete }) {
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const formatDayName = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.split(':').slice(0, 2).join(':');
  };

  const getStatusPresensi = () => {
    if (presensi.izin_id) return 'Izin';
    if (presensi.jam_masuk === null) return 'Tanpa Keterangan';
    return presensi.status_masuk || 'Tanpa Keterangan';
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div>
          <p className="text-sm text-gray-900">{formatDate(presensi.tanggal)}</p>
          <p className="text-xs text-gray-500">{formatDayName(presensi.tanggal)}</p>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div>
          <p className="font-medium text-gray-900">{presensi.nama}</p>
          <p className="text-sm text-gray-500">{presensi.jabatan}</p>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
          {presensi.wilayah_penugasan}
        </span>
      </td>
      
      <td className="py-4 px-6">
        <TimeCell 
          time={presensi.jam_masuk}
          foto={presensi.foto_masuk}
          onViewDetail={() => onViewDetail(presensi)}
        />
      </td>
      
      <td className="py-4 px-6">
        <TimeCell 
          time={presensi.jam_pulang}
          foto={presensi.foto_pulang}
          onViewDetail={() => onViewDetail(presensi)}
        />
      </td>
      
      <td className="py-4 px-6">
        <div className="flex flex-col gap-1">
          <StatusBadge 
            status={getStatusPresensi()}
            izinId={presensi.izin_id}
          />
          {presensi.is_lembur === 1 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Lembur: {presensi.jam_lembur}
            </span>
          )}
        </div>
      </td>
      
      <td className="py-4 px-6">
        <ActionButtons
          onView={() => onViewDetail(presensi)}
          onEdit={() => onEdit(presensi)}
          onDelete={() => onDelete(presensi.id)}
        />
      </td>
    </tr>
  );
}

function TimeCell({ time, foto, onViewDetail }) {
  return (
    <div>
      <p className="text-gray-900">{time ? time.split(':').slice(0, 2).join(':') : '-'}</p>
      {foto && (
        <button 
          onClick={onViewDetail}
          className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Camera size={12} />
          Lihat Foto
        </button>
      )}
    </div>
  );
}

function ActionButtons({ onView, onEdit, onDelete }) {
  const actions = [
    { icon: Eye, label: "Lihat Detail", onClick: onView, color: "text-blue-600", hoverColor: "bg-blue-50" },
    { icon: Edit, label: "Edit Data", onClick: onEdit, color: "text-amber-600", hoverColor: "bg-amber-50" },
    { icon: Trash2, label: "Hapus Data", onClick: onDelete, color: "text-red-600", hoverColor: "bg-red-50" }
  ];

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`p-2 text-gray-500 hover:${action.color} hover:${action.hoverColor} rounded-lg transition-colors`}
          title={action.label}
        >
          <action.icon size={18} />
        </button>
      ))}
    </div>
  );
}