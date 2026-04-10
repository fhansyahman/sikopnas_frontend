"use client";

import { Users, Briefcase, MapPin, Settings, UserCheck, UserX, Phone, Mail } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

export function AssignmentTab({ filteredUsers, search, onAssignClick, onRemoveAssignment }) {
  if (filteredUsers.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-8 h-8 text-gray-400" />}
        title={search ? 'Tidak ada user yang sesuai dengan pencarian' : 'Belum ada data user'}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <TableHeader icon={<Users size={14} />} label="Pegawai" />
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <TableHeader icon={<Briefcase size={14} />} label="Jabatan" />
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <TableHeader icon={<MapPin size={14} />} label="Wilayah" />
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <TableHeader icon={<Settings size={14} />} label="Aksi" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onAssignClick={onAssignClick}
              onRemoveAssignment={onRemoveAssignment}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function UserRow({ user, onAssignClick, onRemoveAssignment }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div>
          <p className="font-medium text-gray-900">{user.nama}</p>
          <p className="text-sm text-gray-500">{user.username}</p>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-700">{user.jabatan}</td>
      <td className="py-4 px-6">
        {user.wilayah_penugasan ? (
          <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {user.wilayah_penugasan}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Belum ditugaskan</span>
        )}
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onAssignClick(user)}
            className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-medium hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center gap-2"
          >
            <UserCheck size={12} />
            {user.wilayah_id ? 'Ganti' : 'Tugaskan'}
          </button>
          {user.wilayah_id && (
            <button 
              onClick={() => onRemoveAssignment(user)}
              className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg text-xs font-medium hover:from-red-700 hover:to-pink-700 transition-colors flex items-center gap-2"
            >
              <UserX size={12} />
              Hapus
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}