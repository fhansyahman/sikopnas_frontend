"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, Users, Clock, ClipboardList, CalendarDays, 
  FileBarChart, ChevronDown, Map, ClipboardCheck, List,
  ClipboardX, UserCheck, Calendar, Settings, LogOut 
} from "lucide-react";

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
    title: "Hari Kerja & Libur",
    icon: <CalendarDays size={20} />,
    href: "/atasan/harikerjadanlibur",
    active: true,
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

function SidebarItem({ item, currentPath }) {
  const [open, setOpen] = useState(item.active || false);
  
  const isActive = item.active || 
    (item.href && currentPath === item.href) ||
    (item.submenu && item.submenu.some(sub => currentPath === sub.href));

  return (
    <li className="mb-1">
      <Link
        href={item.href || "#"}
        onClick={(e) => {
          if (item.submenu) {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 no-underline block ${
          isActive 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={isActive ? 'text-white' : 'text-gray-400'}>
            {item.icon}
          </span>
          <span className="text-sm font-medium">{item.title}</span>
        </div>
        {item.submenu && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            } ${isActive ? 'text-white' : 'text-gray-400'}`}
          />
        )}
      </Link>

      {item.submenu && open && (
        <ul className="ml-8 mt-1 space-y-1">
          {item.submenu.map((subItem, index) => (
            <li key={index}>
              <Link
                href={subItem.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors no-underline block ${
                  currentPath === subItem.href 
                    ? 'bg-gray-800 text-cyan-400' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400'
                }`}
              >
                <span className={currentPath === subItem.href ? 'text-cyan-400' : 'text-cyan-500'}>
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

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  return (
    <>
      <aside className={`fixed md:relative z-30 h-full bg-gray-900 border-r border-gray-800 shadow-2xl transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
        md:translate-x-0 md:w-64`}>
        
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div>
            <h1 className="font-bold text-lg text-white">SIKOPNAS</h1>
            <p className="text-xs text-cyan-400">Sistem UPT Wilayah Prajekan</p>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <ul className="space-y-1">
            {sidebarMenu.map((item, index) => (
              <SidebarItem key={index} item={item} currentPath={pathname} />
            ))}
          </ul>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}