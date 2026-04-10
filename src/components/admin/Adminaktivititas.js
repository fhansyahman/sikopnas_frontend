'use client';
import { useState, useEffect } from 'react';
import { adminAktivitasAPI, usersAPI } from '@/lib/api';
import Swal from "sweetalert2";
import { 
  Search, Plus, Edit, Trash2, X, Eye, Home, Menu, LogOut, Lock, ChevronDown, 
  Users, Calendar, Clock, Settings, ClipboardList, FileBarChart, Activity, 
  List, Map, Check, AlertCircle, RefreshCw, Save, Calendar as CalendarIcon, 
  FileText, Download, Filter, BarChart3, Users as UsersIcon, TrendingUp, 
  Database, UserCheck, UserX, Building2, Navigation, Locate, MapPin,
  Play, Square, Timer, BarChart, PieChart, LineChart, DownloadCloud,
  Select, CheckSquare, SquareStack, Archive
} from "lucide-react";
import { useRouter,usePathname } from "next/navigation";
import Link from 'next/link';
export default function AdminManajemenAktivitas() {
  const [aktivitasList, setAktivitasList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedAktivitas, setSelectedAktivitas] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  const [isEdit, setIsEdit] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
 const pathname = usePathname();
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    user_id: '',
    wilayah: '',
    page: 1,
    limit: 20
  });

  const [exportFilters, setExportFilters] = useState({
    start_date: '',
    end_date: '',
    user_id: '',
    wilayah: '',
    format: 'json'
  });

  const router = useRouter();

  // Form data
  const [formData, setFormData] = useState({
    user_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    wilayah: '',
    lokasi: '',
    durasi: '01:00',
    kegiatan: ''
  });

  // Sidebar menu items - TAMBAHKAN INI
  const sidebarMenu = [
    { 
      title: "Dashboard", 
      icon: <Home size={16} />, 
      path: "/admin/dashboard",
      onClick: () => {
        console.log('Navigating to Dashboard');
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
            console.log('Navigating to Data Pekerja');
            router.push("/admin/datapekerja");
          }
        },
        { 
          name: "Status Pegawai", 
          icon: <UserCheck size={14} />, 
          path: "/admin/statuspekerja",
          onClick: () => {
            console.log('Navigating to Status Pegawai');
            router.push("/admin/statuspekerja");
          }
        },
        { 
          name: "Pembagian Wilayah", 
          icon: <Map size={14} />,
          path: "/admin/pembagianwilayah",
          onClick: () => {
            console.log('Navigating to Pembagian Wilayah');
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
            console.log('Navigating to Rekap Presensi');
            router.push("/admin/rekappresensi");
          }
        },
        { 
          name: "Data Presensi", 
          icon: <List size={14} />, 
          path: "/admin/presensi",
          onClick: () => {
            console.log('Navigating to Data Presensi');
            router.push("/admin/presensi");
          }
        },
        { 
          name: "Pemutihan", 
          icon: <Check size={14} />, 
          path: "/admin/pemutihan",
          onClick: () => {
            console.log('Navigating to Pemutihan');
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
            console.log('Navigating to Data Aktivitas');
            router.push("/admin/aktivitaspekerja");
          }
        },
        { 
          name: "Statistik Aktivitas", 
          icon: <BarChart3 size={14} />,
          path: "/admin/statistikaktivitas",
          onClick: () => {
            console.log('Navigating to Statistik Aktivitas');
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
            console.log('Navigating to Data Kinerja');
            router.push("/admin/kinerjaharian");
          }
        },
        { 
          name: "Statistik Kinerja", 
          icon: <BarChart3 size={14} />,
          path: "/admin/statistikkinerja",
          onClick: () => {
            console.log('Navigating to Statistik Kinerja');
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
            console.log('Navigating to Penugasan Wilayah');
            router.push("/admin/manajemenwilayah");
          }
        },
        { 
          name: "Statistik Wilayah", 
          icon: <TrendingUp size={14} />,
          path: "/admin/statistikwilayah",
          onClick: () => {
            console.log('Navigating to Statistik Wilayah');
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
            console.log('Navigating to Persetujuan Izin');
            router.push("/admin/izin");
          }
        },
        { 
          name: "Riwayat Izin", 
          icon: <Clock size={14} />, 
          path: "/admin/riwayatizin",
          onClick: () => {
            console.log('Navigating to Riwayat Izin');
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
            console.log('Navigating to Laporan Kehadiran');
            router.push("/admin/laporankehadiran");
          }
        },
        { 
          name: "Laporan Kinerja", 
          icon: <FileText size={14} />, 
          path: "/admin/laporankinerja",
          onClick: () => {
            console.log('Navigating to Laporan Kinerja');
            router.push("/admin/laporankinerja");
          }
        },
        { 
          name: "Laporan Aktivitas", 
          icon: <Activity size={14} />, 
          path: "/admin/laporanaktivitas",
          onClick: () => {
            console.log('Navigating to Laporan Aktivitas');
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
        console.log('Navigating to Pengaturan');
        router.push("/admin/pengaturan");
      }
    },
  ];

  // Komponen SidebarItem - TAMBAHKAN INI
 const SidebarItem = ({ title, icon, submenu, active, path, onClick }) => {
    const [open, setOpen] = useState(false);
    const isActive = pathname === path;
    
    const handleMainClick = (e) => {
      console.log('Main item clicked:', title);
      if (submenu) {
        e.preventDefault();
        setOpen(!open);
      } else if (onClick) {
        onClick();
      } else if (path) {
        router.push(path);
      }
    };

    const handleSubmenuClick = (subItem) => {
      console.log('Submenu item clicked:', subItem.name);
      if (subItem.onClick) {
        subItem.onClick();
      } else if (subItem.path) {
        router.push(subItem.path);
      }
    };

    // Jika menggunakan Link (lebih recommended)
    const LinkSidebarItem = () => (
      <li className="text-gray-800">
        {path && !submenu ? (
          <Link 
            href={path} 
            onClick={(e) => submenu && handleMainClick(e)}
            className={`block ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}`}
          >
            <div className={`flex items-center justify-between px-4 md:px-5 py-2.5 cursor-pointer hover:bg-gray-200 transition ${
              active ? "bg-gray-300 font-medium" : ""
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
              active ? "bg-gray-300 font-medium" : ""
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
                    onClick={() => handleSubmenuClick(item)}
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

    return <LinkSidebarItem />;
  };

  useEffect(() => {
    if (activeTab === 'data') {
      loadAktivitasData();
      loadUsersData();
    } else if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab, filters]);

  const loadAktivitasData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAktivitasAPI.getAllAktivitas(filters);
      setAktivitasList(response.data.data || []);
      setPagination(response.data.pagination || {});
      
    } catch (error) {
      console.error('Error loading aktivitas:', error);
      setError('Gagal memuat data aktivitas');
      setAktivitasList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersData = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsersList(response.data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminAktivitasAPI.getAktivitasStats(filters);
      setStats(response.data.data || {});
    } catch (error) {
      console.error('Error loading stats:', error);
      setError('Gagal memuat statistik');
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.user_id || !formData.tanggal || !formData.kegiatan) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "User, tanggal, dan kegiatan wajib diisi",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      if (isEdit) {
        await adminAktivitasAPI.updateAktivitas(selectedAktivitas.id, formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data aktivitas berhasil diupdate",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      } else {
        await adminAktivitasAPI.createAktivitas(formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data aktivitas berhasil dibuat",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      }

      setShowFormModal(false);
      resetForm();
      loadAktivitasData();
      if (activeTab === 'stats') loadStats();

    } catch (error) {
      console.error('Error saving aktivitas:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal menyimpan data aktivitas',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleEdit = (aktivitas) => {
    setSelectedAktivitas(aktivitas);
    setFormData({
      user_id: aktivitas.user_id,
      tanggal: aktivitas.tanggal,
      wilayah: aktivitas.wilayah || '',
      lokasi: aktivitas.lokasi || '',
      durasi: aktivitas.durasi || '01:00',
      kegiatan: aktivitas.kegiatan || ''
    });
    setIsEdit(true);
    setShowFormModal(true);
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await adminAktivitasAPI.getAktivitasDetail(id);
      setSelectedAktivitas(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading detail:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Gagal memuat detail aktivitas',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleDelete = async (id, user_nama) => {
    Swal.fire({
      title: 'Hapus Aktivitas?',
      text: `Yakin ingin menghapus aktivitas untuk ${user_nama}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminAktivitasAPI.deleteAktivitas(id);
          
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Aktivitas berhasil dihapus',
            confirmButtonText: 'Oke',
            confirmButtonColor: '#10B981',
          });
          
          loadAktivitasData();
          if (activeTab === 'stats') loadStats();
        } catch (error) {
          console.error('Error deleting aktivitas:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || 'Gagal menghapus aktivitas',
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#EF4444',
          });
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak ada data dipilih",
        text: "Pilih aktivitas yang ingin dihapus",
        confirmButtonText: "Oke",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    Swal.fire({
      title: 'Hapus Aktivitas Terpilih?',
      html: `Yakin ingin menghapus <strong>${selectedItems.length}</strong> aktivitas?<br><small>Tindakan ini tidak dapat dibatalkan</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Ya, Hapus ${selectedItems.length} Data`,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminAktivitasAPI.bulkDeleteAktivitas(selectedItems);
          
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `${selectedItems.length} aktivitas berhasil dihapus`,
            confirmButtonText: 'Oke',
            confirmButtonColor: '#10B981',
          });
          
          setSelectedItems([]);
          loadAktivitasData();
          if (activeTab === 'stats') loadStats();
        } catch (error) {
          console.error('Error bulk deleting aktivitas:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || 'Gagal menghapus aktivitas',
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#EF4444',
          });
        }
      }
    });
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === aktivitasList.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(aktivitasList.map(item => item.id));
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      
      const response = await adminAktivitasAPI.exportAktivitas(exportFilters);
      
      if (exportFilters.format === 'csv') {
        // Handle CSV download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aktivitas-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Handle JSON download
        const dataStr = JSON.stringify(response.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aktivitas-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil diexport',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#10B981',
      });
      
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal mengexport data',
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setExportLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      tanggal: new Date().toISOString().split('T')[0],
      wilayah: '',
      lokasi: '',
      durasi: '01:00',
      kegiatan: ''
    });
    setIsEdit(false);
    setSelectedAktivitas(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const clearFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      user_id: '',
      wilayah: '',
      page: 1,
      limit: 20
    });
    setSearch("");
    setSelectedItems([]);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const filteredAktivitas = aktivitasList.filter((aktivitas) =>
    aktivitas.user_nama?.toLowerCase().includes(search.toLowerCase()) ||
    aktivitas.kegiatan?.toLowerCase().includes(search.toLowerCase()) ||
    aktivitas.lokasi?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDuration = (duration) => {
    if (!duration) return '0j 0m';
    const [hours, minutes] = duration.split(':');
    return `${parseInt(hours)}j ${parseInt(minutes)}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotalDuration = () => {
    return aktivitasList.reduce((total, item) => {
      if (!item.durasi) return total;
      const [hours, minutes] = item.durasi.split(':');
      return total + (parseInt(hours) * 60 + parseInt(minutes));
    }, 0);
  };

  const totalDurationMinutes = calculateTotalDuration();
  const totalHours = Math.floor(totalDurationMinutes / 60);
  const totalMinutes = totalDurationMinutes % 60;

  if (loading && activeTab === 'data') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                active={pathname === item.path}
              />
            ))}
          </ul>
        </nav>

        {/* User info footer */}
        {/* <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
        </div> */}
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
            <h2 className="text-lg font-medium">Admin - Manajemen Aktivitas Pekerja</h2>
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
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('data')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                  activeTab === 'data' 
                    ? 'border-[#009688] text-[#009688]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <List size={16} className="inline mr-2" />
                Data Aktivitas
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                  activeTab === 'stats' 
                    ? 'border-[#009688] text-[#009688]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 size={16} className="inline mr-2" />
                Statistik
              </button>
            </div>

            {/* Data Aktivitas */}
            {activeTab === 'data' && (
              <div>
                {/* Filter Section */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Filter Data</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={clearFilters}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <X size={14} />
                        Hapus Filter
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                      <input
                        type="date"
                        value={filters.start_date}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                      <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pegawai</label>
                      <select
                        value={filters.user_id}
                        onChange={(e) => handleFilterChange('user_id', e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                      >
                        <option value="">Semua Pegawai</option>
                        {usersList.filter(user => user.roles !== 'admin').map(user => (
                          <option key={user.id} value={user.id}>
                            {user.nama} - {user.jabatan}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah</label>
                      <input
                        type="text"
                        value={filters.wilayah}
                        onChange={(e) => handleFilterChange('wilayah', e.target.value)}
                        placeholder="Cari wilayah..."
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Cari berdasarkan nama, kegiatan, atau lokasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                      >
                        <Trash2 size={18} />
                        Hapus ({selectedItems.length})
                      </button>
                    )}
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <DownloadCloud size={18} />
                      Export
                    </button>
                    <button
                      onClick={loadAktivitasData}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <RefreshCw size={18} />
                      Refresh
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowFormModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <Plus size={18} />
                      Tambah
                    </button>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Data</p>
                        <p className="text-2xl font-bold text-blue-800">{pagination.total}</p>
                      </div>
                      <Database className="text-blue-500" size={24} />
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Total Durasi</p>
                        <p className="text-2xl font-bold text-green-800">
                          {totalHours}j {totalMinutes}m
                        </p>
                      </div>
                      <Timer className="text-green-500" size={24} />
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Pegawai Aktif</p>
                        <p className="text-2xl font-bold text-orange-800">
                          {new Set(aktivitasList.map(a => a.user_id)).size}
                        </p>
                      </div>
                      <Users className="text-orange-500" size={24} />
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Rata-rata Durasi</p>
                        <p className="text-2xl font-bold text-purple-800">
                          {aktivitasList.length > 0 ? Math.round(totalDurationMinutes / aktivitasList.length) : 0}m
                        </p>
                      </div>
                      <BarChart className="text-purple-500" size={24} />
                    </div>
                  </div>
                </div>

                {/* Table Aktivitas */}
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-[#009688] text-white">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium w-12">
                          <input
                            type="checkbox"
                            checked={selectedItems.length === aktivitasList.length && aktivitasList.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="p-3 text-left text-sm font-medium">Tanggal</th>
                        <th className="p-3 text-left text-sm font-medium">Pegawai</th>
                        <th className="p-3 text-left text-sm font-medium">Wilayah</th>
                        <th className="p-3 text-left text-sm font-medium">Lokasi</th>
                        <th className="p-3 text-left text-sm font-medium">Durasi</th>
                        <th className="p-3 text-left text-sm font-medium">Kegiatan</th>
                        <th className="p-3 text-center text-sm font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aktivitasList.map((aktivitas) => (
                        <tr key={aktivitas.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(aktivitas.id)}
                              onChange={() => handleSelectItem(aktivitas.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-800">
                                {new Date(aktivitas.tanggal).toLocaleDateString('id-ID')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(aktivitas.created_at).toLocaleTimeString('id-ID')}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-800">{aktivitas.user_nama}</p>
                              <p className="text-xs text-gray-500">{aktivitas.user_jabatan}</p>
                              <p className={`text-xs ${aktivitas.user_status ? 'text-green-600' : 'text-red-600'}`}>
                                {aktivitas.user_status ? 'Aktif' : 'Nonaktif'}
                              </p>
                            </div>
                          </td>
                          <td className="p-3 text-gray-700">
                            {aktivitas.wilayah || aktivitas.user_wilayah || '-'}
                          </td>
                          <td className="p-3 text-gray-700">
                            <div className="max-w-xs">
                              <p className="truncate" title={aktivitas.lokasi}>
                                {aktivitas.lokasi || '-'}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {formatDuration(aktivitas.durasi)}
                            </span>
                          </td>
                          <td className="p-3 text-gray-700">
                            <div className="max-w-xs">
                              <p className="truncate" title={aktivitas.kegiatan}>
                                {aktivitas.kegiatan}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => handleViewDetail(aktivitas.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                                title="Detail"
                              >
                                <Eye size={14} />
                              </button>
                              <button 
                                onClick={() => handleEdit(aktivitas)}
                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={() => handleDelete(aktivitas.id, aktivitas.user_nama)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                                title="Hapus"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600">
                      Menampilkan {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.total)} dari {pagination.total} data
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 border rounded-lg ${
                              filters.page === pageNum
                                ? 'bg-[#009688] text-white border-[#009688]'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === pagination.totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {aktivitasList.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-500">
                    <Activity size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      {search || Object.values(filters).some(f => f && f !== '1' && f !== '20') 
                        ? 'Tidak ada aktivitas yang sesuai dengan pencarian' 
                        : 'Belum ada data aktivitas'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Statistik Aktivitas */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">Statistik Aktivitas Pekerja</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={loadStats}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <RefreshCw size={18} />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Summary Cards */}
                {stats.summary && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Total Aktivitas</p>
                          <p className="text-2xl font-bold text-blue-800">{stats.summary.total_aktivitas}</p>
                        </div>
                        <Activity className="text-blue-500" size={32} />
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Total Pegawai</p>
                          <p className="text-2xl font-bold text-green-800">{stats.summary.total_pegawai}</p>
                        </div>
                        <Users className="text-green-500" size={32} />
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-600 text-sm font-medium">Total Durasi</p>
                          <p className="text-2xl font-bold text-orange-800">
                            {stats.summary.total_durasi_detik 
                              ? `${Math.floor(stats.summary.total_durasi_detik / 3600)} jam` 
                              : '0 jam'
                            }
                          </p>
                        </div>
                        <Timer className="text-orange-500" size={32} />
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">Rata-rata Durasi</p>
                          <p className="text-2xl font-bold text-purple-800">
                            {stats.summary.avg_durasi_detik 
                              ? `${Math.floor(stats.summary.avg_durasi_detik / 60)} menit` 
                              : '0 menit'
                            }
                          </p>
                        </div>
                        <BarChart className="text-purple-500" size={32} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Performers */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Users className="text-blue-500" size={20} />
                      Top 10 Pegawai Beraktivitas
                    </h4>
                    <div className="space-y-3">
                      {stats.top_performers?.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-yellow-100' : 
                              index === 1 ? 'bg-gray-100' : 
                              index === 2 ? 'bg-orange-100' : 'bg-blue-100'
                            }`}>
                              <span className={`font-bold text-sm ${
                                index === 0 ? 'text-yellow-600' : 
                                index === 1 ? 'text-gray-600' : 
                                index === 2 ? 'text-orange-600' : 'text-blue-600'
                              }`}>
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{user.nama}</p>
                              <p className="text-xs text-gray-500">{user.jabatan}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{user.total_aktivitas} aktivitas</p>
                            <p className="text-xs text-gray-500">
                              {user.total_durasi_detik 
                                ? `${Math.floor(user.total_durasi_detik / 3600)}j ${Math.floor((user.total_durasi_detik % 3600) / 60)}m` 
                                : '0j 0m'
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aktivitas per Wilayah */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="text-green-500" size={20} />
                      Aktivitas per Wilayah
                    </h4>
                    <div className="space-y-3">
                      {stats.wilayah_stats?.slice(0, 8).map((wilayah, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <MapPin className="text-green-500" size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 truncate">
                                {wilayah.wilayah || 'Tidak ditentukan'}
                              </p>
                              <p className="text-xs text-gray-500">{wilayah.total_pegawai} pegawai</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{wilayah.total_aktivitas}</p>
                            <p className="text-xs text-gray-500">aktivitas</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                {stats.recent_activities && stats.recent_activities.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock className="text-purple-500" size={20} />
                      Aktivitas Terbaru
                    </h4>
                    <div className="space-y-3">
                      {stats.recent_activities.map((aktivitas) => (
                        <div key={aktivitas.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <UserCheck className="text-purple-500" size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{aktivitas.user_nama}</p>
                              <p className="text-sm text-gray-600 line-clamp-1">{aktivitas.kegiatan}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(aktivitas.tanggal).toLocaleDateString('id-ID')} • {formatDuration(aktivitas.durasi)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {aktivitas.wilayah || '-'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Modal Form Aktivitas */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#009688]">
                  {isEdit ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
                </h2>
                <button
                  onClick={() => {
                    setShowFormModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-black transition"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pegawai <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.user_id}
                      onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                      required
                    >
                      <option value="">Pilih Pegawai</option>
                      {usersList
                        .filter(user => user.roles !== 'admin' && user.is_active)
                        .map(user => (
                          <option key={user.id} value={user.id}>
                            {user.nama} - {user.jabatan} - {user.wilayah_penugasan}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wilayah
                    </label>
                    <input
                      type="text"
                      value={formData.wilayah}
                      onChange={(e) => setFormData({...formData, wilayah: e.target.value})}
                      placeholder="Masukkan wilayah"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.lokasi}
                      onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                      placeholder="Masukkan lokasi spesifik"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durasi
                  </label>
                  <input
                    type="time"
                    value={formData.durasi}
                    onChange={(e) => setFormData({...formData, durasi: e.target.value})}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kegiatan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.kegiatan}
                    onChange={(e) => setFormData({...formData, kegiatan: e.target.value})}
                    placeholder="Deskripsikan kegiatan yang dilakukan..."
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b] transition flex items-center gap-2"
                  >
                    <Save size={18} />
                    {isEdit ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Aktivitas */}
        {showDetailModal && selectedAktivitas && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#009688]">
                  Detail Aktivitas
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-black transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informasi Pegawai */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Informasi Pegawai</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Nama Lengkap</label>
                      <p className="font-medium">{selectedAktivitas.user_nama}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Username</label>
                      <p className="font-medium">@{selectedAktivitas.user_username}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Jabatan</label>
                      <p className="font-medium">{selectedAktivitas.user_jabatan}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Wilayah Penugasan</label>
                      <p className="font-medium">{selectedAktivitas.user_wilayah || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedAktivitas.user_status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedAktivitas.user_status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informasi Aktivitas */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Informasi Aktivitas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Tanggal</label>
                      <p className="font-medium">{formatDate(selectedAktivitas.tanggal)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Wilayah Aktivitas</label>
                      <p className="font-medium">{selectedAktivitas.wilayah || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Lokasi</label>
                      <p className="font-medium">{selectedAktivitas.lokasi || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Durasi</label>
                      <p className="font-medium">{formatDuration(selectedAktivitas.durasi)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Dibuat Pada</label>
                      <p className="font-medium">
                        {new Date(selectedAktivitas.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Diupdate Pada</label>
                      <p className="font-medium">
                        {new Date(selectedAktivitas.updated_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kegiatan */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Kegiatan</h3>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedAktivitas.kegiatan}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedAktivitas);
                  }}
                  className="px-6 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b] transition flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Export */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#009688]">
                  Export Data Aktivitas
                </h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-500 hover:text-black transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={exportFilters.start_date}
                      onChange={(e) => setExportFilters({...exportFilters, start_date: e.target.value})}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Akhir
                    </label>
                    <input
                      type="date"
                      value={exportFilters.end_date}
                      onChange={(e) => setExportFilters({...exportFilters, end_date: e.target.value})}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pegawai
                  </label>
                  <select
                    value={exportFilters.user_id}
                    onChange={(e) => setExportFilters({...exportFilters, user_id: e.target.value})}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  >
                    <option value="">Semua Pegawai</option>
                    {usersList.filter(user => user.roles !== 'admin').map(user => (
                      <option key={user.id} value={user.id}>
                        {user.nama} - {user.jabatan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wilayah
                  </label>
                  <input
                    type="text"
                    value={exportFilters.wilayah}
                    onChange={(e) => setExportFilters({...exportFilters, wilayah: e.target.value})}
                    placeholder="Cari wilayah..."
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format Export
                  </label>
                  <select
                    value={exportFilters.format}
                    onChange={(e) => setExportFilters({...exportFilters, format: e.target.value})}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleExport}
                  disabled={exportLoading}
                  className="px-6 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b] transition flex items-center gap-2 disabled:opacity-50"
                >
                  {exportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <DownloadCloud size={18} />
                      Export
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}