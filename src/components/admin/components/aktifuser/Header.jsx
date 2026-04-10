"use client";

import { Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();

  const handleLogout = async () => {
  try {
    // 1. Panggil endpoint logout di backend (optional)
    await fetch("/api/logout", { 
      method: "POST",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // 2. Hapus semua data dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken'); // jika ada
    localStorage.clear(); // atau clear semua jika ingin
    
    // 3. Hapus cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // 4. Hapus sessionStorage jika ada
    sessionStorage.clear();
    
    // 5. Reset state axios atau http client jika perlu
    // (jika menggunakan axios instance dengan default headers)
    
    console.log("✅ Logout berhasil, semua data client telah dihapus");
    
    // 6. Redirect ke login
    router.push("/login");
    
  } catch (error) {
    console.error("❌ Error saat logout:", error);
    // Tetap hapus data client meskipun request ke backend gagal
    localStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
            <h2 className="text-lg font-semibold text-white">Manajemen Status Pegawai</h2>
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