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
      href: "/atasan/dashboard",
      active: true, // Ditambahkan properti active: true
    },
    {
      title: "Kehadiran",
      icon: <Clock size={20} />,
      href: "/atasan/kehadiran",
      submenu: [
        { name: "Detail Presensi Hari Ini", icon: <FileText size={14} />, href: "/atasan/presensihariini" },
        { name: "Atur Waktu Kerja", icon: <Clock size={14} />, href: "/atasan/waktukerja" },
      ],
    },
    {
      title: "Kinerja Harian",
      icon: <Clipboard size={20} />,
      href: "/atasan/datakinerja"
    },
    {
      title: "Izin & Cuti",
      icon: <FileText size={20} />,
      href: "/atasan/izinataucuti"
    }, 
    {
      title: "Laporan",
      icon: <FileBarChart2 size={20} />,
      href: "/atasan/laporan",
      submenu: [
        { name: "Laporan Kehadiran", icon: <ClipboardCheck size={14} />, href: "/atasan/laporankehadiran" },
        { name: "Laporan Kinerja", icon: <ClipboardX size={14} />, href: "/atasan/laporankinerja" },
      ],
    },
  ];

  return { sidebarOpen, setSidebarOpen, sidebarMenu };
}