"use client";

import { X, Users, Phone, Mail } from "lucide-react";

export function UsersModal({ isOpen, onClose, selectedWilayah }) {
  if (!isOpen || !selectedWilayah) return null;

  const users = selectedWilayah.users || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <ModalHeader 
          title={`Users di Wilayah ${selectedWilayah.nama_wilayah}`}
          total={users.length}
          onClose={onClose}
        />

        <div className="p-6">
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        <ModalFooter onClose={onClose} />
      </div>
    </div>
  );
}

function ModalHeader({ title, total, onClose }) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">Total: {total} user</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <X size={20} className="text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-medium text-gray-900">{user.nama}</p>
          <p className="text-sm text-gray-600">{user.jabatan}</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.is_active ? '🟢 Aktif' : '⚫ Nonaktif'}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Phone size={12} />
          <span>{user.no_hp || '-'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Mail size={12} />
          <span>{user.username}</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
        <Users size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-500">Belum ada user yang ditugaskan di wilayah ini</p>
      <p className="text-sm text-gray-400 mt-2">Tugaskan user melalui menu Penugasan Wilayah</p>
    </div>
  );
}

function ModalFooter({ onClose }) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex justify-end">
        <button
          onClick={onClose}
        className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}