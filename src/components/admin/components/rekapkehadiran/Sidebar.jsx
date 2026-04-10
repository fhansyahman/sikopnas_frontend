"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Users, Clock, ClipboardList, CalendarDays, 
  FileBarChart, ChevronDown, Map as MapIcon, 
  ClipboardCheck, ClipboardX, List 
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

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
      submenu: [
        { name: "Data Pekerja", icon: <Users size={14} />, href: "/admin/datapekerja" },
        { name: "Status Kontrak", icon: <ClipboardCheck size={14} />, href: "/admin/statuskontrak" },
        { name: "Pembagian Wilayah", icon: <MapIcon size={14} />, href: "/admin/pembagianwilayah" },
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
      href: "/admin/datakinerja"
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
          <div>
            <h1 className="font-bold text-lg text-white">SIKOPNAS</h1>
            <p className="text-xs text-cyan-400">Sistem UPT Wilayah Prajekan</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarMenu.map((item, index) => (
              <SidebarItem
                key={index}
                title={item.title}
                icon={item.icon}
                submenu={item.submenu}
                active={item.active}
                href={item.href}
                currentPath={pathname}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}