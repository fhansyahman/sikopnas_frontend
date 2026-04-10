"use client";

import { useState } from "react";
import { MapPin, Users, ChevronDown, ChevronUp, Search, Eye } from "lucide-react";
import { formatNumber } from "../../utils/dashboard/formatters";

export function TabelWilayahPekerja({ dataWilayah, onViewDetail }) {
  const [expandedWilayah, setExpandedWilayah] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("all");

  const toggleWilayah = (wilayah) => {
    setExpandedWilayah(prev => ({
      ...prev,
      [wilayah]: !prev[wilayah]
    }));
  };

  // Filter data berdasarkan pencarian dan wilayah
  const filteredData = dataWilayah.filter(item => {
    const matchesSearch = item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nip?.includes(searchTerm) ||
                         item.jabatan?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWilayah = filterWilayah === "all" || item.wilayah_penugasan === filterWilayah;
    
    return matchesSearch && matchesWilayah;
  });

  // Group by wilayah
  const groupedByWilayah = filteredData.reduce((acc, item) => {
    const wilayah = item.wilayah_penugasan || 'Tanpa Wilayah';
    if (!acc[wilayah]) {
      acc[wilayah] = [];
    }
    acc[wilayah].push(item);
    return acc;
  }, {});

  const wilayahList = Object.keys(groupedByWilayah).sort();

  // Hitung statistik per wilayah
  const getWilayahStats = (wilayah) => {
    const pegawai = groupedByWilayah[wilayah];
    const total = pegawai.length;
    const hadir = pegawai.filter(p => p.status_kehadiran === 'Hadir' || p.status_kehadiran === 'Tepat Waktu').length;
    const terlambat = pegawai.filter(p => p.status_kehadiran === 'Terlambat' || p.status_kehadiran === 'Terlambat Berat').length;
    const izin = pegawai.filter(p => p.status_kehadiran === 'Izin' || p.izin_id).length;
    const sakit = pegawai.filter(p => p.status_kehadiran === 'Sakit').length;
    const tanpaKeterangan = pegawai.filter(p => p.status_kehadiran === 'Tanpa Keterangan' || !p.jam_masuk).length;
    
    return { total, hadir, terlambat, izin, sakit, tanpaKeterangan };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Data Pekerja per Wilayah</h3>
              <p className="text-sm text-gray-600">Total {filteredData.length} pekerja tersebar di {wilayahList.length} wilayah</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pekerja..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <select
              value={filterWilayah}
              onChange={(e) => setFilterWilayah(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Semua Wilayah</option>
              {wilayahList.map(wilayah => (
                <option key={wilayah} value={wilayah}>{wilayah}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Wilayah List */}
      <div className="divide-y divide-gray-200">
        {wilayahList.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">Tidak ada data pekerja</p>
          </div>
        ) : (
          wilayahList.map(wilayah => {
            const stats = getWilayahStats(wilayah);
            const isExpanded = expandedWilayah[wilayah];
            const pegawaiList = groupedByWilayah[wilayah];

            return (
              <div key={wilayah} className="hover:bg-gray-50 transition-colors">
                {/* Wilayah Header */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleWilayah(wilayah)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">{wilayah}</h4>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {stats.total} Pekerja
                      </span>
                    </div>
                    
                    {/* Statistik Mini */}
                    <div className="flex items-center gap-4 ml-8">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">{stats.hadir} Hadir</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-gray-600">{stats.terlambat} Terlambat</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-gray-600">{stats.izin + stats.sakit} Izin/Sakit</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600">{stats.tanpaKeterangan} Tanpa Ket.</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-gray-500 uppercase">
                          <th className="text-left py-2">Nama</th>
                          <th className="text-left py-2">NIP</th>
                          <th className="text-left py-2">Jabatan</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Jam Masuk</th>
                          <th className="text-left py-2">Jam Pulang</th>
                          <th className="text-left py-2">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pegawaiList.map((pegawai, idx) => (
                          <tr key={idx} className="text-sm hover:bg-white">
                            <td className="py-2">
                              <p className="font-medium text-gray-900">{pegawai.nama}</p>
                            </td>
                            <td className="py-2 text-gray-600">{pegawai.nip || '-'}</td>
                            <td className="py-2 text-gray-600">{pegawai.jabatan || '-'}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                pegawai.status_kehadiran === 'Hadir' || pegawai.status_kehadiran === 'Tepat Waktu' ? 'bg-green-100 text-green-700' :
                                pegawai.status_kehadiran === 'Terlambat' || pegawai.status_kehadiran === 'Terlambat Berat' ? 'bg-amber-100 text-amber-700' :
                                pegawai.status_kehadiran === 'Izin' ? 'bg-purple-100 text-purple-700' :
                                pegawai.status_kehadiran === 'Sakit' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {pegawai.status_kehadiran || 'Belum Presensi'}
                              </span>
                            </td>
                            <td className="py-2 text-gray-600">{pegawai.jam_masuk ? new Date(pegawai.jam_masuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                            <td className="py-2 text-gray-600">{pegawai.jam_pulang ? new Date(pegawai.jam_pulang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                            <td className="py-2">
                              <button
                                onClick={() => onViewDetail(pegawai)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Eye size={14} />
                                <span className="text-xs">Detail</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Summary */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Total Wilayah</p>
            <p className="font-bold text-gray-900">{wilayahList.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Total Pekerja</p>
            <p className="font-bold text-gray-900">{filteredData.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Hadir</p>
            <p className="font-bold text-green-600">
              {filteredData.filter(p => p.status_kehadiran === 'Hadir' || p.status_kehadiran === 'Tepat Waktu').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Izin/Sakit</p>
            <p className="font-bold text-purple-600">
              {filteredData.filter(p => p.status_kehadiran === 'Izin' || p.status_kehadiran === 'Sakit' || p.izin_id).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Belum Presensi</p>
            <p className="font-bold text-red-600">
              {filteredData.filter(p => !p.jam_masuk && p.status_kehadiran !== 'Izin' && p.status_kehadiran !== 'Sakit').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}