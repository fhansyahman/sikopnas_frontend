'use client';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'atasan': return 'bg-blue-100 text-blue-800';
      case 'pegawai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'atasan': return 'Supervisor';
      case 'pegawai': return 'Pegawai';
      default: return role;
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">SIKOPNAS</h1>
            <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.roles)}`}>
              {getRoleText(user?.roles)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.nama}</p>
              <p className="text-sm text-gray-500">{user?.jabatan}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}