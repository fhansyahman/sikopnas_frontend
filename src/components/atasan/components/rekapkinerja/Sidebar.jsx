"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Users, Clock, ClipboardList, CalendarDays, 
  FileBarChart, ChevronDown, Map, ClipboardCheck, List,
  ClipboardX, Menu
} from "lucide-react";
import { useState } from "react";

const sidebarMenu = [
  { 
    title: "Dashboard", 
    icon: <Home size={20} />,
    href: "/atasan/dashboard"
  },
  {
    title: "Kehadiran",
    icon: <Clock size={20} />,
    href: "/atasan/kehadiran",
    submenu: [
      { name: "Detail Presensi Hari Ini", icon: <List size={14} />, href: "/atasan/presensihariini" },
      { name: "Atur Waktu Kerja", icon: <Clock size={14} />, href: "/atasan/waktukerja" },
    ],
  },
  {
    title: "Kinerja Harian",
    icon: <ClipboardList size={20} />,
    href: "/atasan/datakinerja",
  },
  {
    title: "Izin & Cuti",
    icon: <ClipboardList size={20} />,
    href: "/atasan/izinataucuti"
  }, 
  {
    title: "Laporan",
    icon: <FileBarChart size={20} />,
    href: "/atasan/laporan",
    submenu: [
      { name: "Laporan Kehadiran", icon: <ClipboardCheck size={14} />, href: "/atasan/laporankehadiran" },
      { name: "Laporan Kinerja", icon: <ClipboardX size={14} />, href: "/atasan/laporankinerja" },
    ],
  },
];

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (title) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (href) => {
    return pathname === href;
  };

  const isSubmenuActive = (submenu) => {
    return submenu?.some(item => pathname === item.href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed md:relative z-30 h-full bg-gray-900 border-r border-gray-800 shadow-2xl transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
        md:translate-x-0 md:w-64`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-lg text-white">SIKOPNAS</h1>
              <p className="text-xs text-cyan-400">Sistem UPT Wilayah Prajekan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <ul className="space-y-1">
            {sidebarMenu.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                isActive={isActive}
                isSubmenuActive={isSubmenuActive}
                openSubmenus={openSubmenus}
                onToggleSubmenu={toggleSubmenu}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ item, isActive, isSubmenuActive, openSubmenus, onToggleSubmenu }) {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isOpen = openSubmenus[item.title] || isSubmenuActive(item.submenu);
  const active = isActive(item.href) || isSubmenuActive(item.submenu);

  const handleClick = (e) => {
    if (hasSubmenu) {
      e.preventDefault();
      onToggleSubmenu(item.title);
    }
  };

  return (
    <li className="mb-1">
      <Link
        href={item.href || "#"}
        onClick={handleClick}
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 no-underline ${
          active ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 
          'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={active ? 'text-white' : 'text-gray-400'}>
            {item.icon}
          </span>
          <span className="text-sm font-medium">{item.title}</span>
        </div>
        {hasSubmenu && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            } ${active ? 'text-white' : 'text-gray-400'}`}
          />
        )}
      </Link>

      {hasSubmenu && isOpen && (
        <ul className="ml-8 mt-1 space-y-1">
          {item.submenu.map((subItem, index) => (
            <li key={index}>
              <Link
                href={subItem.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors no-underline ${
                  isActive(subItem.href) 
                    ? 'bg-gray-800 text-cyan-400' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400'
                }`}
              >
                <span className={isActive(subItem.href) ? 'text-cyan-400' : 'text-cyan-500'}>
                  {subItem.icon}
                </span>
                <span>{subItem.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}