import { 
  Home, Users, Clock, ClipboardList, CalendarDays, FileBarChart, Map 
} from "lucide-react";

export const sidebarMenu = [
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
      { 
        name: "Data Pekerja", 
        icon: <Users size={14} />,
        href: "/admin/datapekerja"
      },
      { 
        name: "Status Kontrak", 
        icon: <ClipboardList size={14} />,
        href: "/admin/statuskontrak"
      },
      { 
        name: "Pembagian Wilayah", 
        icon: <Map size={14} />,
        href: "/admin/pembagianwilayah"
      },
    ],
  },
  {
    title: "Kehadiran",
    icon: <Clock size={20} />,
    href: "/admin/kehadiran",
    submenu: [
      { 
        name: "Detail Presensi Hari Ini", 
        icon: <ClipboardList size={14} />,
        href: "/admin/presensihariini"
      },
      { 
        name: "Atur Waktu Kerja", 
        icon: <Clock size={14} />,
        href: "/admin/waktukerja"
      },
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
      { 
        name: "Laporan Kehadiran", 
        icon: <ClipboardList size={14} />,
        href: "/admin/laporankehadiran"
      },
      { 
        name: "Laporan Kinerja", 
        icon: <FileBarChart size={14} />,
        href: "/admin/laporankinerja"
      },
    ],
  },
];