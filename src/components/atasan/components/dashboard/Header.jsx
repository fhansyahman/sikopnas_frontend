'use client';

import { Menu, LogOut, MapPin, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
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

  const tabs = [
    { id: 'map', label: 'Peta Presensi', icon: MapPin },
    { id: 'monitoring', label: 'Monitoring Harian', icon: AlertCircle },
    { id: 'presensi', label: 'Grafik Kehadiran', icon: Clock },
    { id: 'kinerja', label: 'Grafik Kinerja', icon: TrendingUp },

  ];

  const getIcon = (iconComponent) => {
    const Icon = iconComponent;
    return <Icon size={16} />;
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
            <h2 className="text-lg font-semibold text-white">Dashboard Monitoring</h2>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex space-x-2 px-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getIcon(tab.icon)}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}