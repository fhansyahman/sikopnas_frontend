"use client";

import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home, Users, Clock, ClipboardList, CalendarDays,
  FileBarChart, ChevronDown, Map, List, ClipboardCheck,
  ClipboardX, BarChart3
} from "lucide-react";

const sidebarMenu = [
  { 
    title: "Dashboard", 
    icon: <Home size={20} />,
    href: "/admin/dashboard"
  },
  {
    title: "Manajemen Pekerja",
    icon: <Users size={20} />,
    href: "/admin/manajemen-pekerja",
    active: true,
    submenu: [
      { name: "Data Pekerja", icon: <Users size={14} />, href: "/admin/datapekerja" },
      { name: "Status Kontrak", icon: <ClipboardCheck size={14} />, href: "/admin/statuskontrak" },
      { name: "Pembagian Wilayah", icon: <Map size={14} />, href: "/admin/pembagianwilayah" },
    ],
  },
  {
    title: "Kehadiran",
    icon: <Clock size={20} />,
    href: "/admin/kehadiran",
    submenu: [
      { name: "Detail Presensi Hari Ini", icon: <List size={14} />, href: "/admin/presensihariini" },
      { name: "Atur Waktu Kerja", icon: <Clock size={14} />, href: "/admin/waktukerja" },
    ],
  },
  {
    title: "Kinerja Harian",
    icon: <ClipboardList size={20} />,
    href: "/admin/datakinerja",
  },
  {
    title: "Hari Kerja & Libur",
    icon: <CalendarDays size={20} />,
    href: "/admin/harikerjadanlibur",
  },
  {
    title: "Izin & Cuti",
    icon: <ClipboardList size={20} />,
    href: "/admin/izinataucuti"
  }, 
  {
    title: "Laporan",
    icon: <FileBarChart size={20} />,
    href: "/admin/laporan",
    submenu: [
      { name: "Laporan Kehadiran", icon: <ClipboardCheck size={14} />, href: "/admin/laporankehadiran" },
      { name: "Laporan Kinerja", icon: <ClipboardX size={14} />, href: "/admin/laporankinerja" },
    ],
  },
];

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  
  return (
    <aside className={`fixed md:relative z-30 h-full bg-gray-900 border-r border-gray-800 shadow-2xl transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
      md:translate-x-0 md:w-64`}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div>
          <h1 className="font-bold text-lg text-white">SIKOPNAS</h1>
          <p className="text-xs text-cyan-400">Sistem UPT Wilayah Prajekan</p>
        </div>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarMenu.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              currentPath={pathname}
              onItemClick={onClose}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SidebarItem({ item, currentPath, onItemClick }) {
  const [open, setOpen] = useState(item.active || false);
  
  const isActive = item.active || 
    (item.href && currentPath === item.href) ||
    (item.submenu && item.submenu.some(sub => currentPath === sub.href));

  if (item.submenu) {
    return (
      <li className="mb-1">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 
            'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={isActive ? 'text-white' : 'text-gray-400'}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.title}</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            } ${isActive ? 'text-white' : 'text-gray-400'}`}
          />
        </button>

        {open && (
          <ul className="ml-8 mt-1 space-y-1">
            {item.submenu.map((subItem, index) => (
              <li key={index}>
                <Link
                  href={subItem.href}
                  onClick={onItemClick}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors no-underline block ${
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

  return (
    <li className="mb-1">
      <Link
        href={item.href}
        onClick={onItemClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 no-underline block ${
          isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 
          'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <span className={isActive ? 'text-white' : 'text-gray-400'}>
          {item.icon}
        </span>
        <span className="text-sm font-medium">{item.title}</span>
      </Link>
    </li>
  );
}