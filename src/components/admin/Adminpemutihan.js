'use client';
import { useState, useEffect } from 'react';
import { pemutihanAPI, wilayahAPI } from '@/lib/api';
import Swal from "sweetalert2";
import { 
  Search, Filter, Calendar, RefreshCw, Check, X, 
  Eye, Home, Menu, LogOut, Lock, ChevronDown, 
  Settings, ClipboardList, FileText, Download,
  ChevronDown as ChevronDownIcon, Users, RotateCcw,
  CheckCircle, XCircle, AlertCircle, BarChart3,
  Clock, UserCheck, UserX,FileBarChart,List,Activity,MapPin,TrendingUp,
  Trash2, Info, CalendarDays, ShieldAlert, ShieldCheck, ShieldOff, 
  FileWarning, ClipboardCheck, AlertTriangle, User, Clock3, CalendarClock,
  Database, AlertOctagon, ArrowRightCircle, ArrowLeftCircle
} from "lucide-react";
import { useRouter,usePathname } from "next/navigation";
import Link from 'next/link';

export default function PemutihanPresensi() {
  const [dataPemutihan, setDataPemutihan] = useState([]);
  const [stats, setStats] = useState({});
  const [periode, setPeriode] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
  const [filterWilayah, setFilterWilayah] = useState('all');
  const [wilayahList, setWilayahList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showProsesModal, setShowProsesModal] = useState(false);
  const [showBatalModal, setShowBatalModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [riwayatData, setRiwayatData] = useState([]);
  const [riwayatStats, setRiwayatStats] = useState({});
  const [formData, setFormData] = useState({
    catatan_pemutihan: '',
    jenis_pemutihan: 'manual',
    alasan_pembatalan: ''
  });
  const [userRole, setUserRole] = useState('admin'); // Default role, bisa diambil dari auth
  const router = useRouter();
  const pathname = usePathname();

  // Generate tahun options
  const tahunOptions = Array.from({ length: 3 }, (_, i) => {
    const tahun = new Date().getFullYear() - i;
    return tahun;
  });

  // Bulan options
  const bulanOptions = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  // Jenis pemutihan options
  const jenisPemutihanOptions = [
    { value: 'manual', label: 'Manual oleh Admin' },
    { value: 'otomatis', label: 'Otomatis oleh Sistem' }
  ];

  // Status pemutihan options untuk filter riwayat
  const statusPemutihanOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'diputihkan', label: 'Sudah Diputihkan' },
    { value: 'dibatalkan', label: 'Dibatalkan' }
  ];

  // Load wilayah dari data users yang ada
  const loadWilayahData = async () => {
    try {
      const wilayahFromUsers = [
        'Cermee',
        'Prajekan', 
        'Botolinggo',
        'Klabang',
        'Ijen'
      ];
      
      const formattedWilayah = wilayahFromUsers.map((wilayah) => ({
        id: wilayah.toLowerCase(),
        nama_wilayah: wilayah
      }));
      
      setWilayahList([{ id: 'all', nama_wilayah: 'Semua Wilayah' }, ...formattedWilayah]);
    } catch (error) {
      console.error('Error loading wilayah:', error);
      setWilayahList([
        { id: 'all', nama_wilayah: 'Semua Wilayah' },
        { id: 'cermee', nama_wilayah: 'Cermee' },
        { id: 'prajekan', nama_wilayah: 'Prajekan' },
        { id: 'botolinggo', nama_wilayah: 'Botolinggo' },
        { id: 'klabang', nama_wilayah: 'Klabang' },
        { id: 'ijen', nama_wilayah: 'Ijen' }
      ]);
    }
  };

  useEffect(() => {
    loadWilayahData();
  }, []);

  useEffect(() => {
    loadDataPemutihan();
  }, [filterBulan, filterTahun, filterWilayah]);

  const loadDataPemutihan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pemutihanAPI.getDataForPemutihan({
        bulan: filterBulan,
        tahun: filterTahun,
        wilayah: filterWilayah !== 'all' ? filterWilayah : undefined
      });
      
      console.log('Data pemutihan response:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        setDataPemutihan(data.presensi || []);
        setStats(data.stats || {});
        setPeriode(data.periode || {});
        setSelectedItems([]);
      } else {
        setError(response.data.message || 'Gagal memuat data');
        setDataPemutihan([]);
        setStats({});
      }
      
    } catch (error) {
      console.error('Error loading data pemutihan:', error);
      setError(error.response?.data?.message || 'Gagal memuat data pemutihan');
      setDataPemutihan([]);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const loadRiwayatPemutihan = async () => {
    try {
      const startDate = `${filterTahun}-${filterBulan.toString().padStart(2, '0')}-01`;
      const endDate = new Date(filterTahun, filterBulan, 0).toISOString().split('T')[0];
      
      const response = await pemutihanAPI.getRiwayatPemutihan({
        start_date: startDate,
        end_date: endDate,
        wilayah: filterWilayah !== 'all' ? filterWilayah : undefined,
        jenis: 'all'
      });
      
      console.log('Riwayat data:', response.data);
      
      if (response.data.success) {
        setRiwayatData(response.data.data.riwayat || []);
        setRiwayatStats(response.data.data.stats || {});
        setShowRiwayatModal(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message || "Gagal memuat data riwayat",
          confirmButtonText: "Tutup",
          confirmButtonColor: "#EF4444",
        });
      }
    } catch (error) {
      console.error('Error loading riwayat pemutihan:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal memuat data riwayat pemutihan',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleSelectItem = (presensiId) => {
    setSelectedItems(prev => {
      if (prev.includes(presensiId)) {
        return prev.filter(id => id !== presensiId);
      } else {
        return [...prev, presensiId];
      }
    });
  };

  const handleSelectAll = () => {
    // Hanya pilih data yang bisa diputihkan
    const bisaDiputihkan = filteredData
      .filter(item => item.bisa_diputihkan && !item.sudah_diputihkan && !item.sudah_dibatalkan)
      .map(item => item.presensi_id);
    
    if (selectedItems.length === bisaDiputihkan.length && bisaDiputihkan.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(bisaDiputihkan);
    }
  };

  const handleProsesPemutihan = async (e) => {
    e.preventDefault();
    try {
      if (!formData.catatan_pemutihan.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "Catatan pemutihan wajib diisi",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      // Filter hanya data yang bisa diputihkan
      const bisaDiputihkan = dataPemutihan.filter(item => 
        selectedItems.includes(item.presensi_id) && 
        item.bisa_diputihkan && 
        !item.sudah_diputihkan && 
        !item.sudah_dibatalkan
      );

      if (bisaDiputihkan.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Valid",
          text: "Tidak ada data yang valid untuk diputihkan",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      const response = await pemutihanAPI.prosesPemutihan({
        presensi_ids: bisaDiputihkan.map(item => item.presensi_id),
        catatan_pemutihan: formData.catatan_pemutihan,
        jenis_pemutihan: formData.jenis_pemutihan
      });

      console.log('Response proses pemutihan:', response.data);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          html: `
            <div class="text-left">
              <p class="mb-2">${response.data.message}</p>
              <p class="text-sm text-gray-600">Diproses: ${response.data.data.affected_rows} data</p>
              <p class="text-sm text-gray-600">Catatan: ${response.data.data.catatan_pemutihan}</p>
            </div>
          `,
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });

        setShowProsesModal(false);
        setFormData({ 
          catatan_pemutihan: '', 
          jenis_pemutihan: 'manual', 
          alasan_pembatalan: '' 
        });
        setSelectedItems([]);
        loadDataPemutihan();
      } else {
        throw new Error(response.data.message || 'Gagal memproses pemutihan');
      }

    } catch (error) {
      console.error('Error proses pemutihan:', error);
      
      // Cek apakah ada error spesifik dari backend
      if (error.response?.data?.data) {
        const errorData = error.response.data.data;
        if (errorData.sudah_diputihkan || errorData.diluar_wilayah) {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            html: `
              <div class="text-left">
                <p class="mb-2">${error.response.data.message}</p>
                ${errorData.sudah_diputihkan ? `
                  <p class="text-sm font-medium mt-3">Data sudah diputihkan:</p>
                  <ul class="text-sm text-gray-600 list-disc ml-4">
                    ${errorData.sudah_diputihkan.map(item => `<li>${item.nama} (ID: ${item.id})</li>`).join('')}
                  </ul>
                ` : ''}
                ${errorData.diluar_wilayah ? `
                  <p class="text-sm font-medium mt-3">Data di luar wilayah:</p>
                  <ul class="text-sm text-gray-600 list-disc ml-4">
                    ${errorData.diluar_wilayah.map(item => `<li>${item.nama} - ${item.wilayah}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `,
            confirmButtonText: "Tutup",
            confirmButtonColor: "#EF4444",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response?.data?.message || 'Gagal memproses pemutihan',
            confirmButtonText: "Tutup",
            confirmButtonColor: "#EF4444",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || 'Gagal memproses pemutihan',
          confirmButtonText: "Tutup",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const handleBatalPemutihan = async (e) => {
    e.preventDefault();
    try {
      if (!formData.alasan_pembatalan.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "Alasan pembatalan wajib diisi",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      // Filter hanya data yang sudah diputihkan
      const sudahDiputihkan = dataPemutihan.filter(item => 
        selectedItems.includes(item.presensi_id) && 
        item.sudah_diputihkan && 
        !item.sudah_dibatalkan
      );

      if (sudahDiputihkan.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Valid",
          text: "Tidak ada data pemutihan yang bisa dibatalkan",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      const response = await pemutihanAPI.batalkanPemutihan({
        presensi_ids: sudahDiputihkan.map(item => item.presensi_id),
        alasan_pembatalan: formData.alasan_pembatalan
      });

      console.log('Response batal pemutihan:', response.data);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          html: `
            <div class="text-left">
              <p class="mb-2">${response.data.message}</p>
              <p class="text-sm text-gray-600">Dibatalkan: ${response.data.data.affected_rows} data</p>
              <p class="text-sm text-gray-600">Alasan: ${response.data.data.alasan_pembatalan}</p>
            </div>
          `,
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });

        setShowBatalModal(false);
        setFormData({ 
          catatan_pemutihan: '', 
          jenis_pemutihan: 'manual', 
          alasan_pembatalan: '' 
        });
        setSelectedItems([]);
        loadDataPemutihan();
      } else {
        throw new Error(response.data.message || 'Gagal membatalkan pemutihan');
      }

    } catch (error) {
      console.error('Error batal pemutihan:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal membatalkan pemutihan',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const filteredData = dataPemutihan.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase()) ||
    item.jabatan?.toLowerCase().includes(search.toLowerCase()) ||
    item.wilayah_penugasan?.toLowerCase().includes(search.toLowerCase()) ||
    item.status_kehadiran?.toLowerCase().includes(search.toLowerCase()) ||
    item.kategori?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (kategori, sudahDiputihkan, sudahDibatalkan) => {
    if (sudahDibatalkan) return 'bg-gray-100 text-gray-800';
    if (sudahDiputihkan) return 'bg-purple-100 text-purple-800';
    
    switch(kategori) {
      case 'Alpha Total': return 'bg-red-100 text-red-800';
      case 'Belum Pulang': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (kategori, sudahDiputihkan, sudahDibatalkan) => {
    if (sudahDibatalkan) return <ShieldOff size={14} />;
    if (sudahDiputihkan) return <ShieldCheck size={14} />;
    
    switch(kategori) {
      case 'Alpha Total': return <Database size={14} />;
      case 'Belum Pulang': return <Clock3 size={14} />;
      default: return <Info size={14} />;
    }
  };

  const getPemutihanStatus = (sudahDiputihkan, sudahDibatalkan, bisaDiputihkan) => {
    if (sudahDibatalkan) {
      return { text: 'Dibatalkan', color: 'bg-gray-100 text-gray-800', icon: <ShieldOff size={12} /> };
    }
    if (sudahDiputihkan) {
      return { text: 'Sudah Diputihkan', color: 'bg-purple-100 text-purple-800', icon: <ShieldCheck size={12} /> };
    }
    if (bisaDiputihkan) {
      return { text: 'Bisa Diputihkan', color: 'bg-green-100 text-green-800', icon: <Check size={12} /> };
    }
    return { text: 'Tidak Bisa', color: 'bg-gray-100 text-gray-800', icon: <X size={12} /> };
  };

  // Format jam untuk display
  const formatJam = (jam) => {
    if (!jam) return '-';
    return jam.substring(0, 5); // Format HH:mm
  };

  // Sidebar menu items
  const sidebarMenu = [
    { 
      title: "Dashboard", 
      icon: <Home size={16} />, 
      path: "/admin/dashboard",
      onClick: () => {
        router.push("/admin/dashboard");
      }
    },
    {
      title: "Manajemen Pekerja",
      icon: <Users size={16} />,
      submenu: [
        { 
          name: "Data Pekerja", 
          icon: <Users size={14} />, 
          path: "/admin/datapekerja",
          onClick: () => {
            router.push("/admin/datapekerja");
          }
        },
        { 
          name: "Status Pegawai", 
          icon: <UserCheck size={14} />, 
          path: "/admin/statuspekerja",
          onClick: () => {
            router.push("/admin/statuspekerja");
          }
        },
        { 
          name: "Pembagian Wilayah", 
          icon: <MapPin size={14} />,
          path: "/admin/pembagianwilayah",
          onClick: () => {
            router.push("/admin/pembagianwilayah");
          }
        },
      ],
    },
    {
      title: "Presensi",
      icon: <Clock size={16} />,
      submenu: [
        { 
          name: "Rekap Presensi", 
          icon: <FileBarChart size={14} />, 
          path: "/admin/rekappresensi",
          onClick: () => {
            router.push("/admin/rekappresensi");
          }
        },
        { 
          name: "Data Presensi", 
          icon: <List size={14} />, 
          path: "/admin/presensi",
          onClick: () => {
            router.push("/admin/presensi");
          }
        },
        { 
          name: "Pemutihan", 
          icon: <ShieldAlert size={14} />, 
          path: "/admin/pemutihan",
          onClick: () => {
            router.push("/admin/pemutihan");
          }
        },
      ],
    },
    {
      title: "Aktivitas Pekerja",
      icon: <Activity size={16} />,
      submenu: [
        { 
          name: "Data Aktivitas", 
          icon: <List size={14} />, 
          path: "/admin/aktivitaspekerja",
          onClick: () => {
            router.push("/admin/aktivitaspekerja");
          }
        },
        { 
          name: "Statistik Aktivitas", 
          icon: <BarChart3 size={14} />,
          path: "/admin/statistikaktivitas",
          onClick: () => {
            router.push("/admin/statistikaktivitas");
          }
        },
      ],
    },
    {
      title: "Kinerja Harian",
      icon: <ClipboardList size={16} />,
      submenu: [
        { 
          name: "Data Kinerja", 
          icon: <List size={14} />, 
          path: "/admin/kinerjaharian",
          onClick: () => {
            router.push("/admin/kinerjaharian");
          }
        },
        { 
          name: "Statistik Kinerja", 
          icon: <BarChart3 size={14} />,
          path: "/admin/statistikkinerja",
          onClick: () => {
            router.push("/admin/statistikkinerja");
          }
        },
      ],
    },
    {
      title: "Manajemen Wilayah",
      icon: <MapPin size={16} />,
      submenu: [
        { 
          name: "Penugasan Wilayah", 
          icon: <UserCheck size={14} />, 
          path: "/admin/manajemenwilayah",
          onClick: () => {
            router.push("/admin/manajemenwilayah");
          }
        },
        { 
          name: "Statistik Wilayah", 
          icon: <TrendingUp size={14} />,
          path: "/admin/statistikwilayah",
          onClick: () => {
            router.push("/admin/statistikwilayah");
          }
        },
      ],
    },
    {
      title: "Izin & Cuti",
      icon: <ClipboardList size={16} />,
      submenu: [
        { 
          name: "Persetujuan Izin", 
          icon: <Check size={14} />, 
          path: "/admin/izin",
          onClick: () => {
            router.push("/admin/izin");
          }
        },
        { 
          name: "Riwayat Izin", 
          icon: <Clock size={14} />, 
          path: "/admin/riwayatizin",
          onClick: () => {
            router.push("/admin/riwayatizin");
          }
        },
      ],
    },
    {
      title: "Laporan",
      icon: <FileBarChart size={16} />,
      submenu: [
        { 
          name: "Laporan Kehadiran", 
          icon: <Activity size={14} />, 
          path: "/admin/laporankehadiran",
          onClick: () => {
            router.push("/admin/laporankehadiran");
          }
        },
        { 
          name: "Laporan Kinerja", 
          icon: <FileText size={14} />, 
          path: "/admin/laporankinerja",
          onClick: () => {
            router.push("/admin/laporankinerja");
          }
        },
        { 
          name: "Laporan Aktivitas", 
          icon: <Activity size={14} />, 
          path: "/admin/laporanaktivitas",
          onClick: () => {
            router.push("/admin/laporanaktivitas");
          }
        },
      ],
    },
    { 
      title: "Pengaturan", 
      icon: <Settings size={16} />, 
      path: "/admin/pengaturan",
      onClick: () => {
        router.push("/admin/pengaturan");
      }
    },
  ];

  // Komponen SidebarItem
  const SidebarItem = ({ title, icon, submenu, path, onClick }) => {
    const [open, setOpen] = useState(false);
    const isActive = pathname === path || (submenu && submenu.some(item => pathname === item.path));
    
    const handleMainClick = (e) => {
      if (submenu) {
        e.preventDefault();
        setOpen(!open);
      } else if (onClick) {
        onClick();
      } else if (path) {
        router.push(path);
      }
    };

    return (
      <li className="text-gray-800">
        {path && !submenu ? (
          <Link 
            href={path} 
            onClick={(e) => submenu && handleMainClick(e)}
            className={`block ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}`}
          >
            <div className={`flex items-center justify-between px-4 md:px-5 py-2.5 cursor-pointer hover:bg-gray-200 transition ${
              isActive ? "bg-gray-300 font-medium" : ""
            }`}>
              <div className="flex items-center gap-3">
                {icon && <span>{icon}</span>}
                <span className="text-sm md:text-base">{title}</span>
              </div>
              {submenu && (
                <ChevronDown
                  size={14}
                  className={`text-gray-600 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>
          </Link>
        ) : (
          <div 
            onClick={handleMainClick}
            className={`flex items-center justify-between px-4 md:px-5 py-2.5 cursor-pointer hover:bg-gray-200 transition ${
              isActive ? "bg-gray-300 font-medium" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {icon && <span>{icon}</span>}
              <span className="text-sm md:text-base">{title}</span>
            </div>
            {submenu && (
              <ChevronDown
                size={14}
                className={`text-gray-600 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        )}

        {submenu && open && (
          <ul className="ml-8 md:ml-10 mt-1 border-l border-gray-300">
            {submenu.map((item, index) => (
              <li key={index}>
                {item.path ? (
                  <Link 
                    href={item.path}
                    className={`flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 cursor-pointer text-xs md:text-sm hover:bg-gray-100 rounded-r-lg transition ${
                      pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {item.icon && <span className="text-gray-600">{item.icon}</span>}
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <div
                    onClick={item.onClick}
                    className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 cursor-pointer text-xs md:text-sm text-gray-700 hover:bg-gray-100 rounded-r-lg transition"
                  >
                    {item.icon && <span className="text-gray-600">{item.icon}</span>}
                    <span>{item.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Memuat data pemutihan...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full bg-[#f3f3f3] border-r flex flex-col shadow transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} 
        md:translate-x-0 md:static md:z-auto`}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-center px-4 border-b bg-white">
          <h1 className="font-bold text-lg">
            <span className="text-black">SIK</span>
            <span className="text-green-600">OPNAS</span>{" "}
            <span className="text-xs text-gray-500">v1.0</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="text-sm text-gray-800 space-y-1">
            {sidebarMenu.map((item, index) => (
              <SidebarItem
                key={index}
                title={item.title}
                icon={item.icon}
                submenu={item.submenu}
                path={item.path}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Kontainer utama */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out 
          md:ml-0 ${sidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Header */}
        <header
          className={`bg-[#009688] text-white flex items-center justify-between h-14 px-4 shadow fixed top-0 transition-all duration-300 ease-in-out 
            w-full z-20 md:relative md:top-auto md:z-auto`}
        >
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 rounded-md hover:bg-[#00796b] transition-transform duration-300 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-medium">Pemutihan Presensi</h2>
          </div>

          {/* Profil */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#00796b] transition"
            >
              <img
                src="/images/profile.jpg"
                alt="Foto Profil"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-2xl border border-gray-200 z-50">
                <div className="flex flex-col items-center p-4 border-b border-gray-100">
                  <img
                    src="/images/profile.jpg"
                    alt="Foto Profil"
                    className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
                  />
                  <p className="mt-2 font-semibold text-gray-800">Admin</p>
                  <p className="text-sm text-gray-500">admin@sikopnas.com</p>
                </div>
                <ul className="py-2">
                  <li>
                    <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700">
                      <Eye className="w-4 h-4 mr-2" /> Lihat Profilku
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700">
                      <Lock className="w-4 h-4 mr-2" /> Ubah Password
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 bg-white p-3 md:p-6 overflow-y-auto md:mt-0 mt-14">
          <div className="bg-white border rounded-xl shadow p-4 md:p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={loadDataPemutihan}
                  className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {/* Header dengan Filter dan Actions */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari nama, jabatan, atau wilayah..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                  />
                </div>

                {/* Filter Bulan */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={filterBulan}
                    onChange={(e) => setFilterBulan(parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent appearance-none"
                  >
                    {bulanOptions.map(bulan => (
                      <option key={bulan.value} value={bulan.value}>
                        {bulan.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>

                {/* Filter Tahun */}
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={filterTahun}
                    onChange={(e) => setFilterTahun(parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent appearance-none"
                  >
                    {tahunOptions.map(tahun => (
                      <option key={tahun} value={tahun}>
                        {tahun}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>

                {/* Filter Wilayah */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={filterWilayah}
                    onChange={(e) => setFilterWilayah(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent appearance-none"
                  >
                    {wilayahList.map(wilayah => (
                      <option key={wilayah.id} value={wilayah.id}>
                        {wilayah.nama_wilayah}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={loadDataPemutihan}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>

                <button
                  onClick={loadRiwayatPemutihan}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <FileText size={18} />
                  Riwayat
                </button>
              </div>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">{stats.total || 0}</div>
                <div className="text-sm text-blue-600">Total Data</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-800">{stats.alpha_total || 0}</div>
                <div className="text-sm text-red-600">Alpha Total</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-800">{stats.belum_pulang || 0}</div>
                <div className="text-sm text-orange-600">Belum Pulang</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-800">{stats.bisa_diputihkan || 0}</div>
                <div className="text-sm text-green-600">Bisa Diputihkan</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-800">{stats.total || 0}</div>
                <div className="text-sm text-purple-600">Terpilih</div>
              </div>
            </div>

            {/* Info Periode dan Selected Items */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">
                  Periode: {periode.nama_bulan || `${bulanOptions.find(b => b.value === filterBulan)?.label} ${filterTahun}`}
                </p>
                <p className="text-sm text-gray-600">
                  Menampilkan {filteredData.length} dari {dataPemutihan.length} data
                </p>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {selectedItems.length} data terpilih
                  </span>
                  <div className="flex gap-2">
                    {userRole === 'admin' || userRole === 'supervisor' ? (
                      <button
                        onClick={() => setShowProsesModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center gap-2 transition"
                      >
                        <ShieldCheck size={14} />
                        Proses Pemutihan
                      </button>
                    ) : null}
                    {userRole === 'admin' ? (
                      <button
                        onClick={() => setShowBatalModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center gap-2 transition"
                      >
                        <ShieldOff size={14} />
                        Batalkan Pemutihan
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Info Pemutihan */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Informasi Pemutihan</p>
                  <p className="text-xs text-blue-700">
                    <strong>Alpha Total:</strong> Data presensi kosong total (tanpa masuk dan pulang)<br />
                    <strong>Belum Pulang:</strong> Sudah masuk tapi belum melakukan presensi pulang<br />
                    Hanya data tanpa izin yang bisa diputihkan.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabel Data Pemutihan */}
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-[#009688] text-white">
                  <tr>
                    <th className="p-3 text-center w-12">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredData.filter(item => 
                          item.bisa_diputihkan && !item.sudah_diputihkan && !item.sudah_dibatalkan
                        ).length && 
                        filteredData.filter(item => 
                          item.bisa_diputihkan && !item.sudah_diputihkan && !item.sudah_dibatalkan
                        ).length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={filteredData.filter(item => 
                          item.bisa_diputihkan && !item.sudah_diputihkan && !item.sudah_dibatalkan
                        ).length === 0}
                      />
                    </th>
                    <th className="p-3 text-left text-sm font-medium">Pegawai</th>
                    <th className="p-3 text-left text-sm font-medium">Tanggal</th>
                    <th className="p-3 text-left text-sm font-medium">Jam Masuk</th>
                    <th className="p-3 text-left text-sm font-medium">Jam Pulang</th>
                    <th className="p-3 text-left text-sm font-medium">Kategori</th>
                    <th className="p-3 text-left text-sm font-medium">Keterangan</th>
                    <th className="p-3 text-left text-sm font-medium">Status Pemutihan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => {
                    const pemutihanStatus = getPemutihanStatus(
                      item.sudah_diputihkan, 
                      item.sudah_dibatalkan, 
                      item.bisa_diputihkan
                    );
                    
                    return (
                      <tr key={item.presensi_id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="p-3 text-center">
                          {item.bisa_diputihkan && !item.sudah_diputihkan && !item.sudah_dibatalkan ? (
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.presensi_id)}
                              onChange={() => handleSelectItem(item.presensi_id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-800">{item.nama}</p>
                            <p className="text-xs text-gray-500">{item.jabatan} • {item.wilayah_penugasan}</p>
                          </div>
                        </td>
                        <td className="p-3 text-gray-700 whitespace-nowrap">
                          {new Date(item.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-3 text-gray-700">
                          {item.jam_masuk ? (
                            <div className="space-y-1">
                              <span className="text-gray-800">{formatJam(item.jam_masuk)}</span>
                              <div className="text-xs">
                                <span className={`px-1 py-0.5 rounded ${item.status_masuk === 'Terlambat' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                  {item.status_masuk || 'Tepat Waktu'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-3 text-gray-700">
                          {item.jam_pulang ? (
                            <div className="space-y-1">
                              <span className="text-gray-800">{formatJam(item.jam_pulang)}</span>
                              <div className="text-xs">
                                <span className={`px-1 py-0.5 rounded ${item.status_pulang === 'Terlambat' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                  {item.status_pulang || 'Tepat Waktu'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.kategori, item.sudah_diputihkan, item.sudah_dibatalkan)}`}>
                            {getStatusIcon(item.kategori, item.sudah_diputihkan, item.sudah_dibatalkan)}
                            {item.kategori}
                          </span>
                          {item.izin_id && (
                            <div className="text-xs text-blue-600 mt-1">
                              Izin: {item.jenis_izin}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-gray-700 text-sm max-w-xs">
                          <div className="space-y-1">
                            <p className="line-clamp-2">{item.keterangan_pemutihan || item.keterangan || '-'}</p>
                            {item.keterangan && item.keterangan.includes('PEMUTIHAN:') && (
                              <p className="text-xs text-gray-500 line-clamp-2">{item.keterangan}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${pemutihanStatus.color}`}>
                            {pemutihanStatus.icon}
                            {pemutihanStatus.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <ShieldAlert size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  {search ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data pemutihan'}
                </p>
                <p className="text-sm mt-2">
                  {!search && `Untuk periode ${periode.nama_bulan || bulanOptions.find(b => b.value === filterBulan)?.label} ${filterTahun}`}
                </p>
                {!search && (
                  <button
                    onClick={() => {
                      setFilterBulan(new Date().getMonth() + 1);
                      setFilterTahun(new Date().getFullYear());
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Lihat Bulan Ini
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Proses Pemutihan */}
      {showProsesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#009688]">
                Proses Pemutihan
              </h2>
              <button
                onClick={() => setShowProsesModal(false)}
                className="text-gray-500 hover:text-black transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleProsesPemutihan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Pemutihan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jenis_pemutihan}
                  onChange={(e) => setFormData({...formData, jenis_pemutihan: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  required
                >
                  {jenisPemutihanOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Pemutihan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.catatan_pemutihan}
                  onChange={(e) => setFormData({...formData, catatan_pemutihan: e.target.value})}
                  placeholder="Masukkan alasan/catatan pemutihan..."
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  rows={4}
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Perhatian:</strong> Akan memproses pemutihan untuk {selectedItems.length} data presensi. 
                  <br /><br />
                  <strong>Alpha Total:</strong> Akan diisi dengan jam standar (08:00 - 16:00)<br />
                  <strong>Belum Pulang:</strong> Akan dilengkapi dengan jam pulang standar
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProsesModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <ShieldCheck size={18} />
                  Proses Pemutihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Batalkan Pemutihan */}
      {showBatalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#009688]">
                Batalkan Pemutihan
              </h2>
              <button
                onClick={() => setShowBatalModal(false)}
                className="text-gray-500 hover:text-black transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleBatalPemutihan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Pembatalan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.alasan_pembatalan}
                  onChange={(e) => setFormData({...formData, alasan_pembatalan: e.target.value})}
                  placeholder="Masukkan alasan pembatalan pemutihan..."
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  rows={4}
                  required
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>Perhatian:</strong> Akan membatalkan pemutihan untuk {selectedItems.length} data presensi.
                  Status akan dikembalikan ke kondisi sebelum diputihkan.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBatalModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  <ShieldOff size={18} />
                  Batalkan Pemutihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Riwayat Pemutihan */}
      {showRiwayatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#009688]">
                Riwayat Pemutihan
              </h2>
              <button
                onClick={() => setShowRiwayatModal(false)}
                className="text-gray-500 hover:text-black transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Statistik Riwayat */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-800">{riwayatStats.total || 0}</div>
                <div className="text-sm text-blue-600">Total Riwayat</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-800">{riwayatStats.diputihkan || 0}</div>
                <div className="text-sm text-purple-600">Diputihkan</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-800">{riwayatStats.dibatalkan || 0}</div>
                <div className="text-sm text-red-600">Dibatalkan</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-800">{riwayatStats.alpha_total || 0}</div>
                <div className="text-sm text-orange-600">Alpha Total</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-800">{riwayatStats.belum_pulang || 0}</div>
                <div className="text-sm text-yellow-600">Belum Pulang</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Pegawai</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Tipe</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Jenis</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Catatan</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatData.map((item) => {
                    const getStatusColor = (status) => {
                      switch(status) {
                        case 'diputihkan': return 'bg-purple-100 text-purple-800';
                        case 'dibatalkan': return 'bg-red-100 text-red-800';
                        default: return 'bg-gray-100 text-gray-800';
                      }
                    };

                    return (
                      <tr key={item.presensi_id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-700 whitespace-nowrap">
                          {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-gray-800">{item.nama}</p>
                            <p className="text-xs text-gray-500">{item.wilayah_penugasan}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            item.tipe_pemutihan === 'Alpha Total' ? 'bg-red-100 text-red-800' :
                            item.tipe_pemutihan === 'Belum Pulang' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.tipe_pemutihan === 'Alpha Total' ? <Database size={12} /> :
                             item.tipe_pemutihan === 'Belum Pulang' ? <Clock3 size={12} /> :
                             <Info size={12} />}
                            {item.tipe_pemutihan || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.jenis_pemutihan === 'manual' ? 'Manual' : 
                             item.jenis_pemutihan === 'otomatis' ? 'Otomatis' : 'Unknown'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status_pemutihan)}`}>
                            {item.status_pemutihan === 'diputihkan' ? <ShieldCheck size={12} /> :
                             item.status_pemutihan === 'dibatalkan' ? <ShieldOff size={12} /> :
                             <Info size={12} />}
                            {item.status_pemutihan === 'diputihkan' ? 'Diputihkan' :
                             item.status_pemutihan === 'dibatalkan' ? 'Dibatalkan' : 'Unknown'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700 text-sm max-w-xs">
                          <div className="line-clamp-2">{item.catatan_pemutihan || '-'}</div>
                          {item.keterangan_asli && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.keterangan_asli}</div>
                          )}
                        </td>
                        <td className="p-3 text-gray-700 text-sm whitespace-nowrap">
                          {new Date(item.tanggal_pemutihan).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {riwayatData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Belum ada riwayat pemutihan</p>
              </div>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setShowRiwayatModal(false)}
                className="px-6 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b] transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}