'use client';
import { useState, useEffect } from 'react';
import { userJamKerjaAPI, jamKerjaAPI } from '@/lib/api';
import Swal from "sweetalert2";
import {  Activity,
AlertCircle,
Archive,
BarChart,
BarChart3,
Briefcase,
Building2,
Calendar,
Calendar as CalendarIcon,
Check,
CheckCircle,
CheckSquare,
ChevronDown,
Clipboard,
ClipboardCheck,
ClipboardList,
ClipboardX,
Clock,
Database,
Download,
DownloadCloud,
Edit,
Eye,
FileBarChart,
FileText,
Filter,
Home,
LineChart,
List,
Locate,
Lock,
LogOut,
Map,
MapPin,
Menu,
Navigation,
PieChart,
Play,
Plus,
RefreshCw,
Save,
Search,
Select,
Settings,
Square,
SquareStack,
Timer,
Trash2,
TrendingUp,
UserCheck,
UserX,
Users,
Users as UsersIcon,
X
} from "lucide-react";
import { useRouter,usePathname } from "next/navigation";
import Link from 'next/link';
export default function AssignJamKerja() {
  const [users, setUsers] = useState([]);
  const [jamKerjaOptions, setJamKerjaOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedJamKerja, setSelectedJamKerja] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [bulkAssignData, setBulkAssignData] = useState({
    jam_kerja_id: '',
    user_ids: []
  });
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load users with their jam kerja
      const usersResponse = await userJamKerjaAPI.getUsersWithJamKerja();
      setUsers(usersResponse.data.data || []);

      // Load available jam kerja options
      const jamKerjaResponse = await userJamKerjaAPI.getAvailableJamKerja();
      setJamKerjaOptions(jamKerjaResponse.data.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelection = (userId, isSelected) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleAssignSingle = async (userId, jamKerjaId) => {
    if (!jamKerjaId) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih jam kerja terlebih dahulu",
        confirmButtonText: "Oke",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    try {
      await userJamKerjaAPI.assignJamKerja({
        user_id: userId,
        jam_kerja_id: jamKerjaId
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Jam kerja berhasil diassign",
        confirmButtonText: "Oke",
        confirmButtonColor: "#10B981",
      });

      loadData(); // Reload data
    } catch (error) {
      console.error('Error assigning jam kerja:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal assign jam kerja',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleRemoveJamKerja = async (userId) => {
    Swal.fire({
      title: "Hapus Jam Kerja?",
      text: "Yakin ingin menghapus jam kerja dari user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await userJamKerjaAPI.removeJamKerja({ user_id: userId });

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Jam kerja berhasil dihapus",
            confirmButtonText: "Oke",
            confirmButtonColor: "#10B981",
          });

          loadData();
        } catch (error) {
          console.error('Error removing jam kerja:', error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response?.data?.message || 'Gagal menghapus jam kerja',
            confirmButtonText: "Tutup",
            confirmButtonColor: "#EF4444",
          });
        }
      }
    });
  };

  const handleBulkAssign = async () => {
    if (!bulkAssignData.jam_kerja_id || bulkAssignData.user_ids.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Pilih jam kerja dan minimal satu user",
        confirmButtonText: "Oke",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    try {
      const result = await userJamKerjaAPI.assignJamKerjaBulk(bulkAssignData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: result.data.message || "Jam kerja berhasil diassign ke multiple user",
        confirmButtonText: "Oke",
        confirmButtonColor: "#10B981",
      });

      setShowAssignModal(false);
      setBulkAssignData({ jam_kerja_id: '', user_ids: [] });
      setSelectedUsers([]);
      loadData();
    } catch (error) {
      console.error('Error bulk assigning jam kerja:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal assign jam kerja',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const filteredUsers = users.filter((user) =>
    user.nama?.toLowerCase().includes(search.toLowerCase()) ||
    user.jabatan?.toLowerCase().includes(search.toLowerCase()) ||
    user.wilayah_penugasan?.toLowerCase().includes(search.toLowerCase())
  );

  // Sidebar menu items - PERBAIKI: User -> Users
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

  // Komponen SidebarItem yang sudah diperbaiki
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

  if (loading) {
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
            <h2 className="text-lg font-medium">Assign Jam Kerja ke Karyawan</h2>
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
          {/* Controls */}
          <div className="bg-white border rounded-xl shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute text-black left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari karyawan berdasarkan nama, jabatan, atau wilayah..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (selectedUsers.length === 0) {
                      Swal.fire({
                        icon: "warning",
                        title: "Peringatan",
                        text: "Pilih minimal satu karyawan terlebih dahulu",
                        confirmButtonText: "Oke",
                        confirmButtonColor: "#F59E0B",
                      });
                      return;
                    }
                    setBulkAssignData({
                      ...bulkAssignData,
                      user_ids: selectedUsers
                    });
                    setShowAssignModal(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  disabled={selectedUsers.length === 0}
                >
                  <UserCheck size={18} />
                  Assign ke {selectedUsers.length} Karyawan
                </button>

                <button
                  onClick={loadData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Bulk Selection */}
            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-[#009688] focus:ring-[#009688] h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">
                    Pilih semua ({selectedUsers.length} terpilih dari {filteredUsers.length})
                  </span>
                </div>
                
                {selectedUsers.length > 0 && (
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <UserX size={14} />
                    Batalkan pilihan
                  </button>
                )}
              </div>
            )}

            {/* Table untuk Desktop */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full text-sm text-black">
                <thead className="bg-[#009688] text-white">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-white focus:ring-white h-4 w-4"
                      />
                    </th>
                    <th className="p-3 text-left text-sm font-medium w-12">No</th>
                    <th className="p-3 text-left text-sm font-medium">Nama</th>
                    <th className="p-3 text-left text-sm font-medium">Jabatan</th>
                    <th className="p-3 text-left text-sm font-medium">Wilayah</th>
                    <th className="p-3 text-left text-sm font-medium">Jam Kerja Saat Ini</th>
                    <th className="p-3 text-left text-sm font-medium">Jam Masuk</th>
                    <th className="p-3 text-left text-sm font-medium">Jam Pulang</th>
                    <th className="p-3 text-center text-sm font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                          className="rounded border-gray-300 text-[#009688] focus:ring-[#009688] h-4 w-4"
                        />
                      </td>
                      <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                      <td className="p-3 text-gray-700 font-medium">{user.nama}</td>
                      <td className="p-3 text-gray-700">{user.jabatan}</td>
                      <td className="p-3 text-gray-700">{user.wilayah_penugasan}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.jam_kerja_id 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.nama_setting || 'Belum diassign'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">
                        {user.jam_masuk_standar ? formatTime(user.jam_masuk_standar) : '-'}
                      </td>
                      <td className="p-3 text-gray-700">
                        {user.jam_pulang_standar ? formatTime(user.jam_pulang_standar) : '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          {/* Assign Individual */}
                          <select
                            value={selectedJamKerja}
                            onChange={(e) => {
                              setSelectedJamKerja(e.target.value);
                              if (e.target.value) {
                                handleAssignSingle(user.id, e.target.value);
                              }
                            }}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#009688]"
                          >
                            <option value="">Pilih Jam Kerja</option>
                            {jamKerjaOptions.map((jk) => (
                              <option key={jk.id} value={jk.id}>
                                {jk.nama_setting} ({formatTime(jk.jam_masuk_standar)} - {formatTime(jk.jam_pulang_standar)})
                              </option>
                            ))}
                          </select>

                          {/* Remove Jam Kerja */}
                          {user.jam_kerja_id && (
                            <button
                              onClick={() => handleRemoveJamKerja(user.id)}
                              className="text-red-500 hover:text-red-700 transition text-xs px-2 py-1 border border-red-300 rounded flex items-center gap-1"
                            >
                              <UserX size={12} />
                              Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View untuk Mobile */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#009688] focus:ring-[#009688] h-4 w-4"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{user.nama}</h3>
                        <p className="text-sm text-gray-600">{user.jabatan}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.jam_kerja_id 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.nama_setting || 'Belum diassign'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Wilayah:</span>
                      <p className="text-gray-800">{user.wilayah_penugasan}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Jam Masuk:</span>
                      <p className="text-gray-800">{user.jam_masuk_standar ? formatTime(user.jam_masuk_standar) : '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Jam Pulang:</span>
                      <p className="text-gray-800">{user.jam_pulang_standar ? formatTime(user.jam_pulang_standar) : '-'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                    <select
                      value={selectedJamKerja}
                      onChange={(e) => {
                        setSelectedJamKerja(e.target.value);
                        if (e.target.value) {
                          handleAssignSingle(user.id, e.target.value);
                        }
                      }}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#009688]"
                    >
                      <option value="">Pilih Jam Kerja</option>
                      {jamKerjaOptions.map((jk) => (
                        <option key={jk.id} value={jk.id}>
                          {jk.nama_setting}
                        </option>
                      ))}
                    </select>

                    {user.jam_kerja_id && (
                      <button
                        onClick={() => handleRemoveJamKerja(user.id)}
                        className="w-full text-red-500 hover:text-red-700 transition text-sm px-2 py-1 border border-red-300 rounded flex items-center justify-center gap-1"
                      >
                        <UserX size={14} />
                        Hapus Jam Kerja
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {search ? 'Tidak ada karyawan yang sesuai dengan pencarian' : 'Tidak ada data karyawan'}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Bulk Assign */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#009688]">
                  Assign Jam Kerja ke {selectedUsers.length} Karyawan
                </h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-500 hover:text-black transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Jam Kerja *
                  </label>
                  <select
                    value={bulkAssignData.jam_kerja_id}
                    onChange={(e) => setBulkAssignData({
                      ...bulkAssignData,
                      jam_kerja_id: e.target.value
                    })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    required
                  >
                    <option value="">Pilih Jam Kerja</option>
                    {jamKerjaOptions.map((jk) => (
                      <option key={jk.id} value={jk.id}>
                        {jk.nama_setting} ({formatTime(jk.jam_masuk_standar)} - {formatTime(jk.jam_pulang_standar)})
                        {jk.is_active && ' ⭐'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Karyawan yang akan diassign:</h4>
                  <ul className="text-sm text-blue-700 max-h-32 overflow-y-auto">
                    {users
                      .filter(user => selectedUsers.includes(user.id))
                      .map(user => (
                        <li key={user.id} className="py-1 border-b border-blue-200 last:border-b-0">
                          • {user.nama} - {user.jabatan}
                        </li>
                      ))
                    }
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleBulkAssign}
                    className="px-4 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b] transition flex items-center gap-2"
                  >
                    <Save size={18} />
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}