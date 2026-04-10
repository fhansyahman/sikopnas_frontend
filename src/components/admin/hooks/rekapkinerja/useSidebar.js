'use client';

import { useRouter } from "next/navigation";

export function useSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  // Sidebar menu items
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
        { name: "Rekap Kehadiran", icon: "FileBarChart", href: "/admin/rekapkehadiran" },
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
        { name: "Rekap Kinerja Wilayah", icon: "Globe", href: "/admin/rekap-kinerja", active: true },
      ],
    },
  ];

  return {
    sidebarMenu,
    handleLogout
  };
}