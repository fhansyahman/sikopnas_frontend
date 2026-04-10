'use client';
import { useState, useEffect } from 'react';
import {  Search, Plus, Edit, Trash2, X, Eye, Home, Menu, LogOut, Lock, ChevronDown, 
  Users, Calendar, Clock, Settings, ClipboardList, FileBarChart, Activity, 
  List, Map, Check, AlertCircle, RefreshCw, Save, Calendar as CalendarIcon, 
  FileText, Download, Filter, BarChart3, Users as UsersIcon, TrendingUp, 
  Database, UserCheck, UserX, Building2, Navigation, Locate, MapPin,
  Play, Square, Timer, BarChart, PieChart, LineChart, DownloadCloud,
  Select, CheckSquare, SquareStack, Archive,Search, Download, Filter, Calendar, Users, CheckCircle, Clock, AlertCircle, X, Home, Menu, LogOut, Lock, ChevronDown, FileBarChart, TrendingUp, Database, RefreshCw, Building2, MapPin, UserCheck, UserX } from "lucide-react";

export default function LaporanPresensiBulanan() {
  const [dataPresensi, setDataPresensi] = useState([]);
  const [statistik, setStatistik] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [wilayahFilter, setWilayahFilter] = useState("");
  const [bulanFilter, setBulanFilter] = useState("");
  const [tahunFilter, setTahunFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rekap'); // 'rekap', 'detail', 'statistik'

  // Data contoh dari struktur Excel
  const wilayahData = {
    'PRA': { nama: 'Prajekan', bulan: 'Februari 2018', jumlahPegawai: 32 },
    'WON': { nama: 'Wonosari', bulan: 'Desember 2017', jumlahPegawai: 35 },
    'TAM': { nama: 'Tamanan', bulan: 'Desember 2017', jumlahPegawai: 38 },
    'WRIN': { nama: 'Wringin', bulan: 'Desember 2017', jumlahPegawai: 22 },
    'BOND': { nama: 'Bondowoso', bulan: 'Desember 2017', jumlahPegawai: 46 },
    'DINAS': { nama: 'Dinas', bulan: 'Desember 2017', jumlahPegawai: 84 }
  };

  useEffect(() => {
    loadDataPresensi();
    generateStatistik();
  }, [wilayahFilter, bulanFilter, tahunFilter]);

  const loadDataPresensi = () => {
    setLoading(true);
    // Simulasi loading data
    setTimeout(() => {
      const data = generateSampleData();
      setDataPresensi(data);
      setLoading(false);
    }, 1000);
  };

  const generateStatistik = () => {
    const stats = {
      totalPegawai: Object.values(wilayahData).reduce((sum, w) => sum + w.jumlahPegawai, 0),
      totalHadir: Math.floor(Math.random() * 200) + 150,
      totalTerlambat: Math.floor(Math.random() * 30) + 10,
      totalIzin: Math.floor(Math.random() * 20) + 5,
      totalSakit: Math.floor(Math.random() * 15) + 3,
      totalTanpaKeterangan: Math.floor(Math.random() * 10) + 1
    };

    stats.persenKehadiran = ((stats.totalHadir / stats.totalPegawai) * 100).toFixed(1);
    setStatistik(stats);
  };

  const generateSampleData = () => {
    const sampleData = [];
    const wilayahList = Object.keys(wilayahData);
    
    wilayahList.forEach(wilayah => {
      if (wilayahFilter && wilayah !== wilayahFilter) return;
      
      const dataWilayah = wilayahData[wilayah];
      for (let i = 1; i <= 10; i++) {
        sampleData.push({
          id: `${wilayah}-${i}`,
          nama: `Pegawai ${i} ${dataWilayah.nama}`,
          nip: `1990010${i}200001 1 00${i}`,
          jabatan: 'Staf UPTD',
          wilayah: wilayah,
          namaWilayah: dataWilayah.nama,
          bulan: dataWilayah.bulan,
          tanggal: `2024-${String(i).padStart(2, '0')}-01`,
          hadir: Math.random() > 0.1,
          terlambat: Math.random() > 0.7,
          izin: Math.random() > 0.9,
          sakit: Math.random() > 0.95,
          tanpaKeterangan: Math.random() > 0.98
        });
      }
    });
    
    return sampleData;
  };

  const handleExportExcel = () => {
    // Simulasi export Excel
    alert('Fitur export Excel akan diimplementasikan');
  };

  const getStatusBadge = (status, count) => {
    const statusConfig = {
      'hadir': { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} /> },
      'terlambat': { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={12} /> },
      'izin': { color: 'bg-blue-100 text-blue-800', icon: <UserCheck size={12} /> },
      'sakit': { color: 'bg-orange-100 text-orange-800', icon: <UserX size={12} /> },
      'tanpa-keterangan': { color: 'bg-red-100 text-red-800', icon: <AlertCircle size={12} /> }
    };
    
    const config = statusConfig[status] || statusConfig['tanpa-keterangan'];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {count}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  const filteredData = dataPresensi.filter(item =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.nip.toLowerCase().includes(search.toLowerCase()) ||
    item.wilayah.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out md:ml-0 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Header */}
        <header className="bg-[#009688] text-white flex items-center justify-between h-14 px-4 shadow">
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 rounded-md hover:bg-[#00796b] transition-transform duration-300 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-medium">Laporan Presensi Bulanan</h2>
          </div>
        </header>

        {/* Konten Utama */}
        <main className="flex-1 bg-white p-6 overflow-y-auto">
          {/* Header Laporan */}
          <div className="bg-white border rounded-xl shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">LAPORAN PRESENSI BULANAN</h1>
                <p className="text-gray-600">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG KABUPATEN BONDOWOSO</p>
                <p className="text-sm text-gray-500">Jalan Piere Tendean Nomor 1A Telp (0332) 422446-425226 Fax (0332) 420615</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-lg font-semibold text-gray-800">BONDOWOSO</p>
                <p className="text-gray-600">{new Date().toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('rekap')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                  activeTab === 'rekap' 
                    ? 'border-[#009688] text-[#009688]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Database size={16} className="inline mr-2" />
                Rekap Presensi
              </button>
              <button
                onClick={() => setActiveTab('detail')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                  activeTab === 'detail' 
                    ? 'border-[#009688] text-[#009688]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileBarChart size={16} className="inline mr-2" />
                Detail Harian
              </button>
              <button
                onClick={() => setActiveTab('statistik')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                  activeTab === 'statistik' 
                    ? 'border-[#009688] text-[#009688]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp size={16} className="inline mr-2" />
                Statistik
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, NIP, atau wilayah..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={wilayahFilter}
                  onChange={(e) => setWilayahFilter(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                >
                  <option value="">Semua Wilayah</option>
                  {Object.entries(wilayahData).map(([kode, data]) => (
                    <option key={kode} value={kode}>{data.nama}</option>
                  ))}
                </select>

                <select
                  value={bulanFilter}
                  onChange={(e) => setBulanFilter(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                >
                  <option value="">Semua Bulan</option>
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>

                <select
                  value={tahunFilter}
                  onChange={(e) => setTahunFilter(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                >
                  <option value="">Semua Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>

                <button
                  onClick={loadDataPresensi}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>

                <button
                  onClick={handleExportExcel}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Download size={18} />
                  Export Excel
                </button>
              </div>
            </div>

            {/* Rekap Presensi */}
            {activeTab === 'rekap' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead className="bg-[#009688] text-white">
                    <tr>
                      <th className="p-3 text-left border border-gray-300">NO</th>
                      <th className="p-3 text-left border border-gray-300">NAMA</th>
                      <th className="p-3 text-left border border-gray-300">NIP</th>
                      <th className="p-3 text-left border border-gray-300">JABATAN</th>
                      <th className="p-3 text-left border border-gray-300">WILAYAH</th>
                      <th className="p-3 text-center border border-gray-300">HADIR</th>
                      <th className="p-3 text-center border border-gray-300">TERLAMBAT</th>
                      <th className="p-3 text-center border border-gray-300">IZIN</th>
                      <th className="p-3 text-center border border-gray-300">SAKIT</th>
                      <th className="p-3 text-center border border-gray-300">TANPA KETERANGAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3 border border-gray-300">{index + 1}</td>
                        <td className="p-3 border border-gray-300 font-medium">{item.nama}</td>
                        <td className="p-3 border border-gray-300 text-gray-600">{item.nip}</td>
                        <td className="p-3 border border-gray-300">{item.jabatan}</td>
                        <td className="p-3 border border-gray-300">
                          <span className="flex items-center gap-1">
                            <Building2 size={14} />
                            {item.namaWilayah}
                          </span>
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          {getStatusBadge('hadir', item.hadir ? '20' : '0')}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          {getStatusBadge('terlambat', item.terlambat ? '2' : '0')}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          {getStatusBadge('izin', item.izin ? '1' : '0')}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          {getStatusBadge('sakit', item.sakit ? '1' : '0')}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          {getStatusBadge('tanpa-keterangan', item.tanpaKeterangan ? '1' : '0')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Statistik */}
            {activeTab === 'statistik' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Pegawai</p>
                        <p className="text-2xl font-bold text-blue-800">{statistik.totalPegawai}</p>
                      </div>
                      <Users className="text-blue-500" size={32} />
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Hadir</p>
                        <p className="text-2xl font-bold text-green-800">{statistik.totalHadir}</p>
                      </div>
                      <CheckCircle className="text-green-500" size={32} />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Terlambat</p>
                        <p className="text-2xl font-bold text-yellow-800">{statistik.totalTerlambat}</p>
                      </div>
                      <Clock className="text-yellow-500" size={32} />
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Persentase Kehadiran</p>
                        <p className="text-2xl font-bold text-orange-800">{statistik.persenKehadiran}%</p>
                      </div>
                      <TrendingUp className="text-orange-500" size={32} />
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Grafik Kehadiran per Wilayah</h4>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Grafik akan ditampilkan di sini</p>
                  </div>
                </div>
              </div>
            )}

            {/* Keterangan */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">KETERANGAN:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={12} className="text-green-600" />
                  </span>
                  <span>H = Hadir</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock size={12} className="text-yellow-600" />
                  </span>
                  <span>T = Terlambat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck size={12} className="text-blue-600" />
                  </span>
                  <span>I = Izin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <UserX size={12} className="text-orange-600" />
                  </span>
                  <span>S = Sakit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle size={12} className="text-red-600" />
                  </span>
                  <span>TK = Tanpa Keterangan</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}