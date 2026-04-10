// app/aktivitas/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, FileText, Plus, Edit, Trash2, Search, ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { pegawaiAktivitasAPI } from "@/lib/api";

export default function AktivitasPekerjaPage() {
  const [tab, setTab] = useState("input");
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    wilayah: "",
    lokasi: "",
    durasi: "01:00:00",
    kegiatan: ""
  });
  const [loading, setLoading] = useState(false);
  const [aktivitasList, setAktivitasList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("");
  const [stats, setStats] = useState({
    total_aktivitas: 0,
    total_durasi_detik: 0,
    avg_durasi_detik: 0
  });
  const router = useRouter();

  // Daftar wilayah tetap
  const daftarWilayah = [
    "Cermee",
    "Prajekan", 
    "Botolinggo",
    "Klabang",
    "Ijen"
  ];

  // Durasi options
  const durasiOptions = [
    { value: '00:30:00', label: '30 menit' },
    { value: '01:00:00', label: '1 jam' },
    { value: '01:30:00', label: '1 jam 30 menit' },
    { value: '02:00:00', label: '2 jam' },
    { value: '02:30:00', label: '2 jam 30 menit' },
    { value: '03:00:00', label: '3 jam' },
    { value: '03:30:00', label: '3 jam 30 menit' },
    { value: '04:00:00', label: '4 jam' },
    { value: '04:30:00', label: '4 jam 30 menit' },
    { value: '05:00:00', label: '5 jam' },
    { value: '05:30:00', label: '5 jam 30 menit' },
    { value: '06:00:00', label: '6 jam' },
    { value: '06:30:00', label: '6 jam 30 menit' },
    { value: '07:00:00', label: '7 jam' },
    { value: '07:30:00', label: '7 jam 30 menit' },
    { value: '08:00:00', label: '8 jam' }
  ];

  // Load data dari backend
  useEffect(() => {
    loadAktivitas();
    loadStats();
  }, []);

  const loadAktivitas = async () => {
    try {
      setLoading(true);
      const response = await pegawaiAktivitasAPI.getAllAktivitas();
      if (response.data.success) {
        setAktivitasList(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Gagal memuat data aktivitas');
      }
    } catch (error) {
      console.error('Error loading aktivitas:', error);
      alert(error.response?.data?.message || 'Gagal memuat data aktivitas');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await pegawaiAktivitasAPI.getAktivitasStats();
      if (response.data.success) {
        setStats(response.data.data.summary || {
          total_aktivitas: 0,
          total_durasi_detik: 0,
          avg_durasi_detik: 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Reset form
  const resetForm = () => {
    setForm({
      tanggal: new Date().toISOString().split('T')[0],
      wilayah: "",
      lokasi: "",
      durasi: "01:00:00",
      kegiatan: ""
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tanggal || !form.wilayah || !form.lokasi || !form.durasi || !form.kegiatan) {
      alert("Harap isi semua field yang wajib!");
      return;
    }

    try {
      setLoading(true);
      
      const requestBody = {
        tanggal: form.tanggal,
        wilayah: form.wilayah,
        lokasi: form.lokasi,
        durasi: form.durasi,
        kegiatan: form.kegiatan
      };

      let response;
      if (editId !== null) {
        // Update existing
        response = await pegawaiAktivitasAPI.updateAktivitas(editId, requestBody);
      } else {
        // Create new
        response = await pegawaiAktivitasAPI.createAktivitas(requestBody);
      }

      if (response.data.success) {
        alert(editId !== null ? "Data aktivitas berhasil diperbarui!" : "Laporan aktivitas berhasil disimpan!");
        resetForm();
        await loadAktivitas();
        await loadStats();
        setTab("tampilan");
      } else {
        throw new Error(response.data.message || 'Gagal menyimpan data');
      }
      
    } catch (error) {
      console.error('Error submitting aktivitas:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan laporan aktivitas');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const item = aktivitasList.find(aktivitas => aktivitas.id === id);
    if (item) {
      setForm({
        tanggal: item.tanggal,
        wilayah: item.wilayah,
        lokasi: item.lokasi,
        durasi: item.durasi,
        kegiatan: item.kegiatan
      });
      setEditId(id);
      setTab("input");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus laporan aktivitas ini?")) {
      try {
        setLoading(true);
        const response = await pegawaiAktivitasAPI.deleteAktivitas(id);

        if (response.data.success) {
          await loadAktivitas();
          await loadStats();
          alert('Laporan aktivitas berhasil dihapus');
        } else {
          throw new Error(response.data.message || 'Gagal menghapus data');
        }
      } catch (error) {
        console.error('Error deleting aktivitas:', error);
        alert(error.response?.data?.message || 'Gagal menghapus laporan aktivitas');
      } finally {
        setLoading(false);
      }
    }
  };

  // Format date untuk display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format durasi untuk display
  const formatDurationDisplay = (duration) => {
    const [hours, minutes] = duration.split(':');
    const hourNum = parseInt(hours);
    const minuteNum = parseInt(minutes);
    
    if (hourNum > 0 && minuteNum > 0) {
      return `${hourNum} jam ${minuteNum} menit`;
    } else if (hourNum > 0) {
      return `${hourNum} jam`;
    } else {
      return `${minuteNum} menit`;
    }
  };

  // Filter data berdasarkan pencarian
  const filteredAktivitas = aktivitasList.filter(aktivitas => {
    const matchesSearch = aktivitas.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aktivitas.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aktivitas.wilayah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWilayah = !filterWilayah || aktivitas.wilayah === filterWilayah;
    return matchesSearch && matchesWilayah;
  });

  // Dapatkan daftar wilayah unik untuk filter
  const uniqueWilayah = [...new Set(aktivitasList.map(item => item.wilayah))];

  // Hitung statistik untuk display
  const totalDurasiJam = Math.floor(stats.total_durasi_detik / 3600);
  const efficiency = stats.total_aktivitas > 0 ? 
    Math.min(100, Math.round((stats.total_aktivitas / 20) * 100)) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-blue-800 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/pegawai/dashboard')}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Aktivitas Harian</h1>
                <p className="text-blue-200 mt-1">Kelola dan pantau kegiatan kerja harian Anda</p>
              </div>
            </div>
            <div className="bg-blue-500/30 rounded-full p-3">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="max-w-6xl mx-auto px-6 -mt-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Ringkasan Aktivitas</h2>
            <div className="flex items-center mt-2">
              <div className="flex-1">
                <p className="text-2xl font-bold text-blue-600">{efficiency}%</p>
                <p className="text-gray-600 text-sm">Tingkat Produktivitas</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">{stats.total_aktivitas} aktivitas</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-blue-700">{stats.total_aktivitas}</p>
                  <p className="text-xs text-blue-600">Total Aktivitas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-green-700">{totalDurasiJam} jam</p>
                  <p className="text-xs text-green-600">Total Durasi</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded-lg">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-purple-700">
                    {Math.floor(stats.avg_durasi_detik / 3600)} jam
                  </p>
                  <p className="text-xs text-purple-600">Rata-rata</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-6 pb-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setTab("input")}
              className={`flex items-center space-x-2 flex-1 py-4 font-medium text-sm transition-colors ${
                tab === "input"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Input Aktivitas</span>
            </button>
            <button
              onClick={() => setTab("tampilan")}
              className={`flex items-center space-x-2 flex-1 py-4 font-medium text-sm transition-colors ${
                tab === "tampilan"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Data Aktivitas</span>
            </button>
          </div>

          {/* === TAB: INPUT === */}
          {tab === "input" && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  {editId !== null ? "Edit Laporan Aktivitas" : "Laporan Aktivitas Baru"}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {editId !== null 
                    ? "Perbarui informasi laporan aktivitas" 
                    : "Isi formulir untuk membuat laporan aktivitas baru"
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Dasar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tanggal *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="tanggal"
                        value={form.tanggal}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                      <Calendar className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Wilayah *
                    </label>
                    <select
                      name="wilayah"
                      value={form.wilayah}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Pilih Wilayah</option>
                      {daftarWilayah.map(wilayah => (
                        <option key={wilayah} value={wilayah}>
                          {wilayah}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lokasi Kerja *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lokasi"
                        value={form.lokasi}
                        onChange={handleChange}
                        placeholder="Contoh: Kantor Cabang, Site Project, dll."
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pl-10"
                        required
                      />
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Durasi Pekerjaan *
                    </label>
                    <div className="relative">
                      <select
                        name="durasi"
                        value={form.durasi}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pl-10 appearance-none"
                        required
                      >
                        {durasiOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                      <div className="absolute right-3 top-3.5 text-slate-400 pointer-events-none">▼</div>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Kegiatan */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deskripsi Kegiatan *
                  </label>
                  <textarea
                    name="kegiatan"
                    value={form.kegiatan}
                    onChange={handleChange}
                    placeholder="Jelaskan detail kegiatan pekerjaan yang dilakukan..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={4}
                    required
                  />
                </div>

                {/* Tombol Submit */}
                <div className="flex space-x-4 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setTab("tampilan");
                      resetForm();
                    }}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>
                      {loading 
                        ? "Memproses..." 
                        : editId !== null ? "Perbarui Laporan" : "Simpan Laporan"
                      }
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* === TAB: TAMPILAN === */}
          {tab === "tampilan" && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Data Aktivitas Harian</h2>
                  <p className="text-slate-500 text-sm mt-1">Daftar laporan aktivitas kerja Anda</p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setTab("input");
                  }}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Aktivitas</span>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan kegiatan, lokasi, atau wilayah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={filterWilayah}
                    onChange={(e) => setFilterWilayah(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Semua Wilayah</option>
                    {uniqueWilayah.map(wilayah => (
                      <option key={wilayah} value={wilayah}>
                        {wilayah}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-500 mt-2">Memuat data aktivitas...</p>
                </div>
              ) : filteredAktivitas.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    {searchTerm || filterWilayah ? "Tidak ada aktivitas yang sesuai dengan filter" : "Belum ada laporan aktivitas"}
                  </h3>
                  <p className="text-slate-500">
                    {searchTerm || filterWilayah 
                      ? "Coba sesuaikan kriteria pencarian Anda." 
                      : "Mulai dengan membuat laporan aktivitas pertama Anda."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAktivitas.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex space-x-4 flex-1">
                          <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                            <FileText className="text-blue-600 w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-slate-800 text-lg mb-1">
                                  {item.kegiatan}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(item.tanggal)}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatDurationDisplay(item.durasi)}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {item.wilayah}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-sm text-slate-600">
                                <span className="font-medium">Lokasi:</span> {item.lokasi}
                              </p>
                              <div className="flex items-center text-sm text-slate-500">
                                <User className="w-4 h-4 mr-1" />
                                <span>{item.user_nama} • {item.user_jabatan}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-3 sm:mt-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="flex items-center text-blue-600 text-sm hover:text-blue-700 transition-colors p-1"
                            disabled={loading}
                            title="Edit aktivitas"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center text-red-600 text-sm hover:text-red-700 transition-colors p-1"
                            disabled={loading}
                            title="Hapus aktivitas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}