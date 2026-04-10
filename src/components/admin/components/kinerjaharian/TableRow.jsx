"use client";

import { Eye, FileOutput, Edit, Trash2 } from "lucide-react";

export function TableRow({
  kinerja,
  isSelected,
  onToggleSelect,
  onViewDetail,
  onDownload,
  onEdit,
  onDelete
}) {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatShortDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 md:py-4 md:px-6">
        <div>
          <p className="text-sm font-medium text-gray-900 hidden md:block">
            {formatDate(kinerja.tanggal)}
          </p>
          <p className="text-xs font-medium text-gray-900 md:hidden">
            {formatShortDate(kinerja.tanggal)}
          </p>
          <p className="font-medium text-gray-800 text-sm md:text-base">
            {kinerja.nama}
          </p>
          <p className="text-xs text-gray-500">{kinerja.jabatan}</p>
        </div>
      </td>
      <td className="py-3 px-4 md:py-4 md:px-6">
        <div className="space-y-1">
          <p className="font-medium text-gray-900 text-sm md:text-base">
            {kinerja.ruas_jalan}
          </p>
          <p className="text-xs md:text-sm text-gray-700">
            {kinerja.wilayah_penugasan}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2">
            {kinerja.kegiatan}
          </p>
        </div>
      </td>
      <td className="py-3 px-4 md:py-4 md:px-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">KR:</span>
            <span className="font-semibold text-amber-600 text-sm md:text-base">
              {kinerja.panjang_kr}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">KN:</span>
            <span className="font-semibold text-purple-600 text-sm md:text-base">
              {kinerja.panjang_kn}
            </span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 md:py-4 md:px-6">
        <div className="text-xs md:text-sm text-gray-700">
          <p className="hidden md:block">{formatDateTime(kinerja.created_at)}</p>
          <p className="md:hidden">{formatShortDate(kinerja.created_at)}</p>
        </div>
      </td>
      <td className="py-3 px-4 md:py-4 md:px-6">
        <div className="flex items-center gap-1 md:gap-2">
          <ActionButton
            onClick={onViewDetail}
            icon={<Eye size={16} />}
            color="blue"
            title="Lihat Detail"
          />
          <ActionButton
            onClick={onDelete}
            icon={<Trash2 size={16} />}
            color="red"
            title="Hapus"
          />
        </div>
      </td>
    </tr>
  );
}

function ActionButton({ onClick, icon, color, title }) {
  const colorClasses = {
    blue: "hover:text-blue-600 hover:bg-blue-50",
    purple: "hover:text-purple-600 hover:bg-purple-50",
    green: "hover:text-green-600 hover:bg-green-50",
    red: "hover:text-red-600 hover:bg-red-50"
  };

  return (
    <button
      onClick={onClick}
      className={`p-1.5 md:p-2 text-gray-500 rounded-lg transition-colors ${colorClasses[color]}`}
      title={title}
    >
      {icon}
    </button>
  );
}