"use client";

import { Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();

   const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.clear();
        
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
        });
        
        sessionStorage.clear();
      }
      
      router.push("/login");
      
    } catch (error) {
      console.error("Error saat logout:", error);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 md:hidden"
          >
            <Menu size={20} className="text-gray-300" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">Manajemen Presensi</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-px h-6 bg-gray-700"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
