"use client";

import { useState } from "react";
import { UserPhoto } from "./UserPhoto";
import { Phone, MapPin, Briefcase, MoreVertical, Eye, Edit, Key, Trash2 } from "lucide-react";

export function UserRow({ user, onViewDetail, onEdit, onResetPassword, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  const handleDeleteClick = () => {
    setShowActions(false);
    onDelete(user);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <UserPhoto user={user} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{user.nama}</p>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <ContactInfo user={user} />
      </td>
      
      <td className="py-4 px-6">
        <WorkInfo user={user} />
      </td>
      
      <td className="py-4 px-6">
        <StatusBadges user={user} />
      </td>
      
      <td className="py-4 px-6">
        <ActionButtons
          user={user}
          showActions={showActions}
          setShowActions={setShowActions}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onResetPassword={onResetPassword}
          onDelete={handleDeleteClick}
        />
      </td>
    </tr>
  );
}

function ContactInfo({ user }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Phone size={14} className="text-blue-500" />
        <span className="text-sm text-gray-700">{user.no_hp || '-'}</span>
      </div>
      {user.telegram_id && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{user.telegram_id}</span>
        </div>
      )}
    </div>
  );
}

function WorkInfo({ user }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Briefcase size={14} className="text-amber-500" />
        <span className="text-sm text-gray-900">{user.jabatan || '-'}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-emerald-500" />
        <span className="text-sm text-gray-600">{user.wilayah_penugasan || '-'}</span>
      </div>
    </div>
  );
}

function StatusBadges({ user }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {user.is_active ? '🟢 Aktif' : '⚫ Nonaktif'}
      </span>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        user.roles === 'admin' ? 'bg-purple-100 text-purple-800' :
        user.roles === 'atasan' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {user.roles === 'admin' ? '🛡️ Admin' : 
         user.roles === 'atasan' ? '👔 Atasan' : 
         '👤 Pegawai'}
      </span>
    </div>
  );
}

function ActionButtons({ user, showActions, setShowActions, onViewDetail, onEdit, onResetPassword, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onViewDetail(user)}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Lihat Detail"
      >
        <Eye size={18} />
      </button>
      
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Aksi Lainnya"
        >
          <MoreVertical size={18} />
        </button>
        
        {showActions && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowActions(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
              <button
                onClick={() => {
                  onEdit(user);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit size={14} />
                Edit Data
              </button>
              <button
                onClick={() => {
                  onResetPassword(user);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Key size={14} />
                Reset Password
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
                Hapus Pengguna
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}