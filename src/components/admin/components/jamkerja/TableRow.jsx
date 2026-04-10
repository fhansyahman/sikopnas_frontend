"use client";

import { Clock, Eye, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";

export function TableRow({ jamKerja, onViewDetail, onEdit, onDelete, formatTime, calculateTotalHours }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{jamKerja.nama_setting}</p>
            <p className="text-sm text-gray-500">
              Total: {calculateTotalHours(jamKerja.jam_masuk_standar, jamKerja.jam_pulang_standar)}
            </p>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <TimeCell
          masuk={formatTime(jamKerja.jam_masuk_standar)}
          pulang={formatTime(jamKerja.jam_pulang_standar)}
        />
      </td>
      
      <td className="py-4 px-6">
        <ToleranceCell
          toleransi={formatTime(jamKerja.toleransi_keterlambatan)}
          batas={formatTime(jamKerja.batas_terlambat)}
        />
      </td>
      
      <td className="py-4 px-6">
        <StatusCell isActive={jamKerja.is_active} />
      </td>
      
      <td className="py-4 px-6">
        <ActionButtons
          jamKerja={jamKerja}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

function TimeCell({ masuk, pulang }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-green-50 rounded flex items-center justify-center">
          <span className="text-xs font-medium text-green-700">M</span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Masuk</p>
          <p className="text-sm font-medium text-gray-900">{masuk}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center">
          <span className="text-xs font-medium text-red-700">P</span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Pulang</p>
          <p className="text-sm font-medium text-gray-900">{pulang}</p>
        </div>
      </div>
    </div>
  );
}

function ToleranceCell({ toleransi, batas }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-amber-50 rounded flex items-center justify-center">
          <Clock className="w-3 h-3 text-amber-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Toleransi</p>
          <p className="text-sm font-medium text-gray-900">{toleransi}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center">
          <AlertCircle className="w-3 h-3 text-red-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Batas Terlambat</p>
          <p className="text-sm font-medium text-gray-900">{batas}</p>
        </div>
      </div>
    </div>
  );
}

function StatusCell({ isActive }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? '🟢 Aktif' : '⚫ Nonaktif'}
      </span>
      {isActive && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
          <CheckCircle size={10} />
          Default Setting
        </span>
      )}
    </div>
  );
}

function ActionButtons({ jamKerja, onViewDetail, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onViewDetail(jamKerja)}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Lihat Detail"
      >
        <Eye size={18} />
      </button>
      <button
        onClick={() => onEdit(jamKerja)}
        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        title="Edit Setting"
      >
        <Edit size={18} />
      </button>
      {!jamKerja.is_active && (
        <button
          onClick={() => onDelete(jamKerja)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus Setting"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}