import { useState } from "react";
import { 
  Home, Users, Clock, Clipboard, AlertCircle, CalendarDays,
  FileText, FileBarChart2, BarChart3, CheckSquare, MapPin,
  FileSpreadsheet, ClipboardCheck, ClipboardX, TrendingUp
} from "lucide-react";

export function useSidebar(setActiveTab) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarMenu = [
    { 
      title: "Dashboard", 
      icon: <Home size={20} />,
      href: "/admin/dashboard",
      active: true, // Ditambahkan properti active: true
    },
    {
      title: "Manajemen Pekerja",
      icon: <Users size={20} />,
      href: "/admin/manajemen-pekerja",
      submenu: [
        { name: "Data Pekerja", icon: <Users size={14} />, href: "/admin/datapekerja" },
        { name: "Status Kontrak", icon: <CheckSquare size={14} />, href: "/admin/statuskontrak" },
        { name: "Pembagian Wilayah", icon: <MapPin size={14} />, href: "/admin/pembagianwilayah" },
      ],
    },
    {
      title: "Kehadiran",
      icon: <Clock size={20} />,
      href: "/admin/kehadiran",
      submenu: [
        { name: "Detail Presensi Hari Ini", icon: <FileText size={14} />, href: "/admin/presensihariini" },
        { name: "Atur Waktu Kerja", icon: <Clock size={14} />, href: "/admin/waktukerja" },
      ],
    },
    {
      title: "Kinerja Harian",
      icon: <Clipboard size={20} />,
      href: "/admin/datakinerja"
    },
    {
      title: "Hari Kerja & Libur",
      icon: <CalendarDays size={20} />,
      href: "/admin/harikerjadanlibur",
    },
    {
      title: "Izin & Cuti",
      icon: <FileText size={20} />,
      href: "/admin/izinataucuti"
    }, 
    {
      title: "Laporan",
      icon: <FileBarChart2 size={20} />,
      href: "/admin/laporan",
      submenu: [
        { name: "Laporan Kehadiran", icon: <ClipboardCheck size={14} />, href: "/admin/laporankehadiran" },
        { name: "Laporan Kinerja", icon: <ClipboardX size={14} />, href: "/admin/laporankinerja" },
      ],
    },
  ];

  return { sidebarOpen, setSidebarOpen, sidebarMenu };
}