// Wilayah
export const WILAYAH_LIST = ['Cermee', 'Botolinggo', 'Prajekan', 'Klabang', 'Ijen'];

// Target
export const TARGET_KR_HARIAN = 50;
export const TARGET_KN_HARIAN = 50;

// Bulan
export const BULAN_OPTIONS = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' }
];

export const getNamaBulan = (month) => {
  return BULAN_OPTIONS[parseInt(month) - 1]?.label || '';
};

// Tahun
export const getTahunOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => (currentYear - 2 + i).toString());
};

// Sidebar Menu
export const SIDEBAR_MENU = [
  { title: "Dashboard", icon: "Home", href: "/admin/dashboard" },
  {
    title: "Manajemen Pekerja",
    icon: "Users",
    href: "/admin/manajemen-pekerja",
    submenu: [
      { name: "Data Pekerja", icon: "Users", href: "/admin/datapekerja" },
      { name: "Status Kontrak", icon: "CheckSquare", href: "/admin/statuskontrak" },
      { name: "Pembagian Wilayah", icon: "MapPin", href: "/admin/pembagianwilayah" },
    ],
  },
  {
    title: "Kehadiran",
    icon: "Clock",
    href: "/admin/kehadiran",
    submenu: [
      { name: "Rekap Kehadiran", icon: "FileSpreadsheet", href: "/admin/rekapkehadiran" },
      { name: "Detail Presensi Hari Ini", icon: "FileText", href: "/admin/presensihariini" },
      { name: "Atur Waktu Kerja", icon: "Clock", href: "/admin/waktukerja" },
      { name: "Grafik Kehadiran", icon: "BarChart3", href: "#", tab: 'presensi' },
    ],
  },
  {
    title: "Kinerja Harian",
    icon: "Clipboard",
    href: "/admin/datakinerja",
    submenu: [
      { name: "Data Kinerja", icon: "Clipboard", href: "/admin/datakinerja" },
      { name: "Grafik Pemantauan", icon: "TrendingUp", href: "#", tab: 'kinerja' },
    ]
  },
  {
    title: "Monitoring Harian",
    icon: "AlertCircle",
    href: "#",
    tab: 'monitoring'
  },
  {
    title: "Hari Kerja & Libur",
    icon: "CalendarDays",
    href: "/admin/harikerjadanlibur",
  },
  {
    title: "Izin & Cuti",
    icon: "FileText",
    href: "/admin/izinataucuti"
  },
  {
    title: "Laporan",
    icon: "FileBarChart2",
    href: "/admin/laporan",
    submenu: [
      { name: "Laporan Kehadiran", icon: "ClipboardCheck", href: "/admin/laporankehadiran" },
      { name: "Laporan Kinerja", icon: "ClipboardX", href: "/admin/laporankinerja" },
    ],
  },
];