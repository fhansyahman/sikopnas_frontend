'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Home, Users, Clock, ClipboardList, CalendarDays, FileBarChart, FileCheck, Map, Globe } from "lucide-react";

const iconMap = {
  Home: Home,
  Users: Users,
  Clock: Clock,
  ClipboardList: ClipboardList,
  CalendarDays: CalendarDays,
  FileBarChart: FileBarChart,
  FileCheck: FileCheck,
  Map: Map,
  Globe: Globe,
};

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const sidebarMenu = [
    { 
      title: "Dashboard", 
      icon: "Home",
      href: "/admin/dashboard"
    },
    {
      title: "Manajemen Pekerja",
      icon: "Users",
      href: "/admin/manajemen-pekerja",
      submenu: [
        { name: "Data Pekerja", icon: "Users", href: "/admin/datapekerja" },
        { name: "Status Kontrak", icon: "FileCheck", href: "/admin/statuskontrak" },
        { name: "Pembagian Wilayah", icon: "Map", href: "/admin/pembagianwilayah" },
      ],
    },
    {
      title: "Kehadiran",
      icon: "Clock",
      href: "/admin/kehadiran",
      submenu: [
        { name: "Detail Presensi Hari Ini", icon: "ClipboardList", href: "/admin/presensihariini" },
        { name: "Atur Waktu Kerja", icon: "Clock", href: "/admin/waktukerja" },
      ],
    },
    {
      title: "Kinerja Harian",
      icon: "ClipboardList",
      href: "/admin/datakinerja"
    },
    {
      title: "Hari Kerja & Libur",
      icon: "CalendarDays",
      href: "/admin/harikerjadanlibur",
    },
    {
      title: "Izin & Cuti",
      icon: "ClipboardList",
      href: "/admin/izinataucuti"
    }, 
    {
      title: "Laporan",
      icon: "FileBarChart",
      href: "/admin/laporan",
      submenu: [
        { name: "Laporan Kehadiran", icon: "FileCheck", href: "/admin/laporankehadiran" },
        { name: "Laporan Kinerja", icon: "FileCheck", href: "/admin/laporankinerja" },
      ],
    },
  ];

  return (
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
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarMenu.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              pathname={pathname}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SidebarItem({ item, pathname }) {
  const [open, setOpen] = useState(item.active || false);
  const Icon = iconMap[item.icon] || Home;
  
  const isActive = item.active || 
    (item.href && pathname === item.href) ||
    (item.submenu && item.submenu.some(sub => pathname === sub.href));

  const handleClick = (e) => {
    if (item.submenu) {
      e.preventDefault();
      setOpen(!open);
    }
  };

  return (
    <li className="mb-1">
      <Link
        href={item.href || "#"}
        onClick={handleClick}
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 no-underline block ${
          isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 
          'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={isActive ? 'text-white' : 'text-gray-400'}>
            <Icon size={20} />
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
          {item.submenu.map((subItem, index) => {
            const SubIcon = iconMap[subItem.icon] || Home;
            return (
              <li key={index}>
                <Link
                  href={subItem.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors no-underline block ${
                    pathname === subItem.href 
                      ? 'bg-gray-800 text-cyan-400' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400'
                  }`}
                >
                  <SubIcon size={14} className={pathname === subItem.href ? 'text-cyan-400' : 'text-cyan-500'} />
                  <span>{subItem.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}