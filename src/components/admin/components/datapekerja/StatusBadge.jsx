"use client";

export function StatusBadge({ user }) {
  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'atasan': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return '🛡️';
      case 'atasan': return '👔';
      default: return '👤';
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {user.is_active ? '🟢 Aktif' : '⚫ Nonaktif'}
      </span>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.roles)}`}>
        {getRoleIcon(user.roles)} {user.roles === 'admin' ? 'Admin' : user.roles === 'atasan' ? 'Atasan' : 'Pegawai'}
      </span>
    </div>
  );
}