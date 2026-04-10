"use client";

import { Eye, Check, X } from "lucide-react";
import { StatusBadge, JenisBadge } from "./Badges";

export function IzinTableRow({ 
  izin, 
  isSelected, 
  onToggleSelect, 
  onViewDetail, 
  onUpdateStatus 
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div>
          <p className="font-medium text-gray-900">{izin.nama_pegawai}</p>
          <p className="text-sm text-gray-500">{izin.jabatan}</p>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="space-y-2">
          <JenisBadge jenis={izin.jenis} />
          <div className="text-sm text-gray-700">
            <p className="font-medium">{formatDate(izin.tanggal_mulai)}</p>
            <p className="text-gray-500 text-xs">s/d</p>
            <p className="font-medium">{formatDate(izin.tanggal_selesai)}</p>
            <p className="text-xs text-gray-600 mt-1">
              Durasi: <span className="font-semibold">{izin.durasi_hari} hari</span>
            </p>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
          {izin.wilayah_penugasan}
        </span>
      </td>
      
      <td className="py-4 px-6">
        <StatusBadge status={izin.status} />
      </td>
      
      <td className="py-4 px-6">
        <div className="text-sm text-gray-700">
          <p>{formatDateTime(izin.created_at)}</p>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onViewDetail}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Lihat Detail"
          >
            <Eye size={18} />
          </button>
          {izin.status === 'Pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(izin.id, 'Disetujui')}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Setujui"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => onUpdateStatus(izin.id, 'Ditolak')}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Tolak"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}