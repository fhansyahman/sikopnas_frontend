"use client";

import { MapPin, Edit, Trash2, Users } from "lucide-react";
import { EmptyState } from "./EmptyState";

export function WilayahTab({ filteredWilayah, search, onEdit, onDelete, onViewUsers }) {
  if (filteredWilayah.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="w-8 h-8 text-gray-400" />}
        title={search ? 'Tidak ada wilayah yang sesuai dengan pencarian' : 'Belum ada data wilayah'}
        description={!search && 'Klik tombol "Tambah Wilayah" untuk menambahkan wilayah baru'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredWilayah.map((wilayah) => (
        <WilayahCard
          key={wilayah.id}
          wilayah={wilayah}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewUsers={onViewUsers}
        />
      ))}
    </div>
  );
}

function WilayahCard({ wilayah, onEdit, onDelete, onViewUsers }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
            <MapPin className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{wilayah.nama_wilayah}</h3>
            <p className="text-xs text-gray-500">
              Dibuat: {new Date(wilayah.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </div>
      
      {wilayah.keterangan && (
        <div className="p-3 bg-gray-50 rounded-lg mb-4">
          <p className="text-sm text-gray-600">{wilayah.keterangan}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button 
          onClick={() => onViewUsers(wilayah)}
          className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2 transition-colors"
        >
          <Users size={14} />
          Lihat Users
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(wilayah)}
            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Wilayah"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(wilayah.id, wilayah.nama_wilayah)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Wilayah"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}