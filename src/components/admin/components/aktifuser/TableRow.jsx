"use client";

import { Eye, UserMinus, UserPlus2 } from "lucide-react";

export function TableRow({
  user,
  isSelected,
  onToggleSelect,
  onViewDetail,
  onActivate,
  onDeactivate,
  getStatusBadge,
  getAktivasiBadge,
  formatDate
}) {
  const aktivasiBadge = getAktivasiBadge(user.is_active);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </td>
      <td className="py-4 px-6">
        <div>
          <p className="font-medium text-gray-900">{user.nama}</p>
          <p className="text-xs text-gray-500">@{user.username}</p>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="space-y-1">
          <p className="text-gray-900">{user.jabatan}</p>
          <p className="text-sm text-gray-500">{user.wilayah_penugasan || '-'}</p>
        </div>
      </td>
      <td className="py-4 px-6">
        {getStatusBadge(user.status, user.is_active).element}
      </td>
      <td className="py-4 px-6">
        {aktivasiBadge.element}
      </td>
      <td className="py-4 px-6">
        <div className="text-sm text-gray-700">
          <p>{user.created_at ? formatDate(user.created_at) : '-'}</p>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <ActionButton
            onClick={onViewDetail}
            icon={<Eye size={18} />}
            title="Lihat Detail"
            hoverColor="text-blue-600"
            hoverBg="hover:bg-blue-50"
          />
          
          {user.is_active ? (
            <ActionButton
              onClick={onDeactivate}
              icon={<UserMinus size={18} />}
              title="Nonaktifkan"
              hoverColor="text-red-600"
              hoverBg="hover:bg-red-50"
            />
          ) : (
            <ActionButton
              onClick={onActivate}
              icon={<UserPlus2 size={18} />}
              title="Aktifkan"
              hoverColor="text-green-600"
              hoverBg="hover:bg-green-50"
            />
          )}
        </div>
      </td>
    </tr>
  );
}

function ActionButton({ onClick, icon, title, hoverColor, hoverBg }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-500 ${hoverColor} ${hoverBg} rounded-lg transition-colors`}
      title={title}
    >
      {icon}
    </button>
  );
}