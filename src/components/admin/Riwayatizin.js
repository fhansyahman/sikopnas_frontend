'use client';
import { useState, useEffect } from 'react';
import { izinAPI } from '@/lib/api'; // Pastikan API untuk izin sudah ada
import Swal from "sweetalert2";
import { 
  Search, Download, ClipboardCheck , Calendar, RefreshCw, 
  FileText, List , X, Clock, FileBarChart , Home, Menu, Link ,
  LogOut, Lock, ChevronDown, Users , ClipboardList,CalendarDays ,ClipboardX ,
  Eye, ChevronDown as ChevronDownIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from 'xlsx';

export default function RiwayatIzin() {
  const [izinList, setIzinList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIzin, setSelectedIzin] = useState(null);
  const router = useRouter();

  // Generate tahun options (3 tahun terakhir)
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

  useEffect(() => {
    loadIzinData();
  }, [filterBulan, filterTahun]);

  const loadIzinData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Menggunakan getAllIzin dari backend
      const response = await izinAPI.getAllIzin();
      
      // Filter data berdasarkan bulan dan tahun yang dipilih
      const filteredData = response.data.data.filter(izin => {
        const tanggalMulai = new Date(izin.tanggal_mulai);
        const bulanIzin = tanggalMulai.getMonth() + 1;
        const tahunIzin = tanggalMulai.getFullYear();
        
        return bulanIzin === filterBulan && tahunIzin === filterTahun;
      });
      
      setIzinList(filteredData);
      
    } catch (error) {
      console.error('Error loading riwayat izin:', error);
      setError('Gagal memuat data riwayat izin');
      setIzinList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    try {
      // Format data untuk Excel sesuai dengan struktur backend
      const excelData = filteredIzin.map(izin => ({
        'Nama Pegawai': izin.nama_pegawai,
        'Jabatan': izin.jabatan,
        'Wilayah Penugasan': izin.wilayah_penugasan || '-',
        'Jenis Izin': izin.jenis,
        'Tanggal Mulai': formatTanggal(izin.tanggal_mulai),
        'Tanggal Selesai': formatTanggal(izin.tanggal_selesai),
        'Durasi': `${izin.durasi_hari} hari`,
        'Keterangan': izin.keterangan || '-',
        'Status': izin.status,
        'Tanggal Pengajuan': formatTanggal(izin.created_at),
        'Disetujui Oleh': izin.Disetujui_by_name || '-',
        'Dokumen Pendukung': izin.dokumen_pendukung ? 'Ada' : 'Tidak Ada'
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Nama Pegawai
        { wch: 20 }, // Jabatan
        { wch: 20 }, // Wilayah Penugasan
        { wch: 15 }, // Jenis Izin
        { wch: 15 }, // Tanggal Mulai
        { wch: 15 }, // Tanggal Selesai
        { wch: 10 }, // Durasi
        { wch: 30 }, // Keterangan
        { wch: 12 }, // Status
        { wch: 15 }, // Tanggal Pengajuan
        { wch: 15 }, // Disetujui Oleh
        { wch: 15 }  // Dokumen Pendukung
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Izin');

      // Generate Excel file
      const bulanName = bulanOptions.find(b => b.value === filterBulan)?.label;
      const fileName = `riwayat_izin_${bulanName}_${filterTahun}.xlsx`;
      XLSX.writeFile(wb, fileName);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data riwayat izin berhasil diunduh",
        confirmButtonText: "Oke",
        confirmButtonColor: "#10B981",
      });

    } catch (error) {
      console.error('Error downloading Excel:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengunduh data Excel",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return '-';
    return new Date(datetime).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetail = (izin) => {
    setSelectedIzin(izin);
    setShowDetailModal(true);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const filteredIzin = izinList.filter((izin) =>
    izin.nama_pegawai?.toLowerCase().includes(search.toLowerCase()) ||
    izin.jabatan?.toLowerCase().includes(search.toLowerCase()) ||
    izin.jenis?.toLowerCase().includes(search.toLowerCase()) ||
    izin.status?.toLowerCase().includes(search.toLowerCase()) ||
    izin.wilayah_penugasan?.toLowerCase().includes(search.toLowerCase())
  );

  // Sidebar menu items
  const sidebarMenu = [
   { 
     title: "Dashboard", 
     icon: <Home size={20} />,
     href: "/admin/dashboard",

   },
   {
     title: "Manajemen Pekerja",
     icon: <Users size={20} />,
     href: "/admin/manajemen-pekerja",

     submenu: [
       { 
         name: "Data Pekerja", 
         icon: <Users size={14} />,
         href: "/admin/datapekerja"
       },
       { 
         name: "Status Kontrak", 
         icon: <ClipboardCheck size={14} />,
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
         name: "Rekap Kehadiran", 
         icon: <FileBarChart size={14} />,
         href: "/admin/rekapkehadiran"
       },
       { 
         name: "Detail Presensi Hari Ini", 
         icon: <List size={14} />,
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
     href: "/admin/izinataucuti",
          active: true,
   }, 
   {
     title: "Laporan",
     icon: <FileBarChart size={20} />,
     href: "/admin/laporan",
     submenu: [
       { 
         name: "Laporan Kehadiran", 
         icon: <ClipboardCheck size={14} />,
         href: "/admin/laporankehadiran"
       },
       { 
         name: "Laporan Kinerja", 
         icon: <ClipboardX size={14} />,
         href: "/admin/laporankinerja"
       },
     ],
   },
 ];
 
 const SidebarItem = ({ title, icon, submenu, active, href }) => {
    const [open, setOpen] = useState(active || false);
    const router = useRouter();
    const currentPath = router.pathname;
    
    const isActive = active 
    const handleClick = (e) => {
      if (submenu) {
        e.preventDefault();
        setOpen(!open);
      }
    };
  
    return (
      <li className="mb-1">
        <Link
          href={href || "#"}
          onClick={handleClick}
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 no-underline block ${
            isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 
            'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
              {icon}
            </span>
            <span className="text-sm font-medium">{title}</span>
          </div>
          {submenu && (
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              } ${isActive ? 'text-white' : 'text-gray-400'}`}
            />
          )}
        </Link>
  
        {submenu && open && (
          <ul className="ml-8 mt-1 space-y-1">
            {submenu.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors no-underline block ${
                    currentPath === item.href 
                      ? 'bg-gray-800 text-cyan-400' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400'
                  }`}
                >
                  <span className={currentPath === item.href ? 'text-cyan-400' : 'text-cyan-500'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Memuat data presensi...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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
              title={item.title}
              icon={item.icon}
              submenu={item.submenu}
              active={item.active}
              href={item.href}
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
            <h2 className="text-lg font-medium">Riwayat Izin & Cuti</h2>
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
            {/* Header dengan Filter dan Actions */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari nama, jabatan, atau jenis izin..."
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
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={loadIzinData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>

                <button
                  onClick={handleDownloadExcel}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  disabled={filteredIzin.length === 0}
                >
                  <Download size={18} />
                  Download Excel
                </button>
              </div>
            </div>

            {/* Info Filter */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Menampilkan data untuk: <strong>{bulanOptions.find(b => b.value === filterBulan)?.label} {filterTahun}</strong>
                {filteredIzin.length > 0 && ` - ${filteredIzin.length} data ditemukan`}
              </p>
            </div>

            {/* Tabel Riwayat Izin */}
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-[#009688] text-white">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">Nama Pegawai</th>
                    <th className="p-3 text-left text-sm font-medium">Jabatan</th>
                    <th className="p-3 text-left text-sm font-medium">Jenis Izin</th>
                    <th className="p-3 text-left text-sm font-medium">Tanggal Izin</th>
                    <th className="p-3 text-left text-sm font-medium">Durasi</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-center text-sm font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIzin.map((izin) => (
                    <tr key={izin.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-800">{izin.nama_pegawai}</p>
                          <p className="text-xs text-gray-500">{izin.wilayah_penugasan || 'Tidak ada wilayah'}</p>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">{izin.jabatan}</td>
                      <td className="p-3 text-gray-700">{izin.jenis}</td>
                      <td className="p-3 text-gray-700">
                        <div>
                          <p className="text-sm">{formatTanggal(izin.tanggal_mulai)}</p>
                          <p className="text-xs text-gray-500">s/d {formatTanggal(izin.tanggal_selesai)}</p>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {izin.durasi_hari} hari
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(izin.status)}`}>
                          {izin.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={() => handleViewDetail(izin)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1 transition"
                          >
                            <Eye size={12} />
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredIzin.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  {search ? 'Tidak ada riwayat izin yang sesuai dengan pencarian' : 'Belum ada data riwayat izin'}
                </p>
                <p className="text-sm mt-2">
                  {!search && `Untuk bulan ${bulanOptions.find(b => b.value === filterBulan)?.label} ${filterTahun}`}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Detail Izin */}
      {showDetailModal && selectedIzin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#009688]">
                Detail Izin & Cuti
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-black transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Informasi Pegawai */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Informasi Pegawai</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Nama</label>
                    <p className="font-medium">{selectedIzin.nama_pegawai}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Jabatan</label>
                    <p className="font-medium">{selectedIzin.jabatan}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Wilayah Penugasan</label>
                    <p className="font-medium">{selectedIzin.wilayah_penugasan || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Detail Izin */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Detail Izin</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Jenis Izin</label>
                    <p className="font-medium">{selectedIzin.jenis}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIzin.status)}`}>
                      {selectedIzin.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tanggal Mulai</label>
                    <p className="font-medium">{formatTanggal(selectedIzin.tanggal_mulai)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tanggal Selesai</label>
                    <p className="font-medium">{formatTanggal(selectedIzin.tanggal_selesai)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Durasi Izin</label>
                    <p className="font-medium">{selectedIzin.durasi_hari} hari</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Tanggal Pengajuan</label>
                    <p className="font-medium">{formatDateTime(selectedIzin.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Alasan dan Catatan */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Alasan & Catatan</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Keterangan Izin</label>
                    <p className="font-medium mt-1">{selectedIzin.keterangan || '-'}</p>
                  </div>
                  {selectedIzin.Disetujui_by_name && (
                    <div>
                      <label className="text-sm text-gray-600">Disetujui Oleh</label>
                      <p className="font-medium mt-1">{selectedIzin.Disetujui_by_name}</p>
                    </div>
                  )}
                  {selectedIzin.dokumen_pendukung && (
                    <div>
                      <label className="text-sm text-gray-600">Dokumen Pendukung</label>
                      <p className="font-medium mt-1 text-blue-600">
                        {selectedIzin.dokumen_pendukung}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
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