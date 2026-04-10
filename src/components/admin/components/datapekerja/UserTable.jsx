"use client";

import { UserRow } from "./UserRow";
import { Users, Phone, Briefcase, Activity, Settings } from "lucide-react";

export function UserTable({ users, onViewDetail, onEdit, onResetPassword, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">Tidak ada data pengguna ditemukan</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <TableHeader icon={<Users size={14} />} text="Pengguna" />
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <TableHeader icon={<Phone size={14} />} text="Kontak" />
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <TableHeader icon={<Briefcase size={14} />} text="Jabatan & Wilayah" />
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <TableHeader icon={<Activity size={14} />} text="Status" />
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <TableHeader icon={<Settings size={14} />} text="Aksi" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onViewDetail={onViewDetail}
                onEdit={onEdit}
                onResetPassword={onResetPassword}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHeader({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      <span>{text}</span>
    </div>
  );
}