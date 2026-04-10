'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  MapPin, Users, Navigation, Search, X, Filter, Clock, 
  Loader2, RefreshCw, Calendar, ChevronLeft, ChevronRight, AlertCircle,
  Home, Briefcase, UserCheck, UserX
} from "lucide-react";
import { adminPresensiAPI } from "@/lib/api";

export function MapPresensiContent() {
  const [presensiList, setPresensiList] = useState([]);
  const [allPresensiData, setAllPresensiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPresensi, setSelectedPresensi] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [wilayahList, setWilayahList] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapCenter] = useState([-7.919021, 113.820801]); // Default Prajekan
  const [mapZoom] = useState(11);
  
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const leafletRef = useRef(null);

  const [stats, setStats] = useState({
    total: 0,
    denganLokasiMasuk: 0,
    denganLokasiPulang: 0,
    hadir: 0,
    terlambat: 0,
    izin: 0,
    tanpaKeterangan: 0
  });

  // Load Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        
        leafletRef.current = L;
        
        // Fix untuk icon Leaflet
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        
        setIsMapReady(true);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };
    
    loadLeaflet();
  }, []);

  // Set default tanggal
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFilterTanggal(today);
  }, []);

  // Fetch data presensi
  const fetchPresensiData = useCallback(async (tanggal) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📅 Mengambil data presensi untuk tanggal: ${tanggal}`);
      
      const response = await adminPresensiAPI.getAll({ tanggal });
      
      if (response.data?.success) {
        const allData = response.data.data || [];
        setAllPresensiData(allData);
        
        // Filter data yang memiliki koordinat
        const dataWithLocation = allData.filter(item => {
          const hasLatMasuk = item.latitude_masuk && item.latitude_masuk !== 0;
          const hasLngMasuk = item.longitude_masuk && item.longitude_masuk !== 0;
          const hasLatPulang = item.latitude_pulang && item.latitude_pulang !== 0;
          const hasLngPulang = item.longitude_pulang && item.longitude_pulang !== 0;
          
          return (hasLatMasuk && hasLngMasuk) || (hasLatPulang && hasLngPulang);
        });

        // Format data untuk peta
        const formattedData = [];
        const lokasiYangDigunakan = new Set();
        
        dataWithLocation.forEach(item => {
          if (item.latitude_masuk && item.longitude_masuk) {
            const key = `${item.user_id}-${item.tanggal}-masuk`;
            if (!lokasiYangDigunakan.has(key)) {
              formattedData.push({
                id: `${item.id}-masuk`,
                presensi_id: item.id,
                user_id: item.user_id,
                nama: item.nama,
                jabatan: item.jabatan,
                wilayah_penugasan: item.wilayah_penugasan,
                tanggal: item.tanggal,
                jam: item.jam_masuk,
                status: item.status_masuk,
                jenis: 'masuk',
                lat: parseFloat(item.latitude_masuk),
                lng: parseFloat(item.longitude_masuk),
                is_lembur: item.is_lembur,
                izin_id: item.izin_id
              });
              lokasiYangDigunakan.add(key);
            }
          }
          
          if (item.latitude_pulang && item.longitude_pulang) {
            const key = `${item.user_id}-${item.tanggal}-pulang`;
            if (!lokasiYangDigunakan.has(key)) {
              formattedData.push({
                id: `${item.id}-pulang`,
                presensi_id: item.id,
                user_id: item.user_id,
                nama: item.nama,
                jabatan: item.jabatan,
                wilayah_penugasan: item.wilayah_penugasan,
                tanggal: item.tanggal,
                jam: item.jam_pulang,
                status: item.status_pulang,
                jenis: 'pulang',
                lat: parseFloat(item.latitude_pulang),
                lng: parseFloat(item.longitude_pulang),
                is_lembur: item.is_lembur,
                izin_id: item.izin_id
              });
              lokasiYangDigunakan.add(key);
            }
          }
        });

        setPresensiList(formattedData);
        
        // Hitung statistik
        const hadir = allData.filter(p => p.status_masuk === 'Tepat Waktu').length;
        const terlambat = allData.filter(p => p.status_masuk === 'Terlambat').length;
        const izin = allData.filter(p => p.izin_id !== null).length;
        const tanpaKeterangan = allData.filter(p => 
          p.izin_id === null && !p.jam_masuk
        ).length;
        
        const denganLokasiMasuk = allData.filter(p => 
          p.latitude_masuk && p.longitude_masuk
        ).length;
        
        const denganLokasiPulang = allData.filter(p => 
          p.latitude_pulang && p.longitude_pulang
        ).length;

        // Extract wilayah unik
        const uniqueWilayah = [...new Set(allData.map(p => p.wilayah_penugasan))].filter(Boolean);
        setWilayahList(uniqueWilayah);

        setStats({
          total: allData.length,
          denganLokasiMasuk,
          denganLokasiPulang,
          hadir,
          terlambat,
          izin,
          tanpaKeterangan
        });
        
      } else {
        throw new Error(response.data?.message || 'Gagal mengambil data');
      }
    } catch (err) {
      console.error('Error fetching presensi:', err);
      setError(err.message || 'Gagal memuat data presensi');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data ketika tanggal berubah
  useEffect(() => {
    if (filterTanggal) {
      fetchPresensiData(filterTanggal);
    }
  }, [filterTanggal, fetchPresensiData]);

  // Inisialisasi map
  useEffect(() => {
    if (!isMapReady || !mapRef.current || mapInstanceRef.current || !leafletRef.current) return;

    const L = leafletRef.current;

    const map = L.map(mapRef.current).setView(mapCenter, mapZoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    mapInstanceRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapReady, mapCenter, mapZoom]);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    
    if (!map || !markerLayerRef.current || !L || !isMapReady) return;

    markerLayerRef.current.clearLayers();

    // Filter data
    const filteredData = presensiList.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.nama?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesWilayah = filterWilayah === '' || item.wilayah_penugasan === filterWilayah;
      
      return matchesSearch && matchesWilayah;
    });

    if (filteredData.length === 0) {
      // Default marker
      const defaultIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin bg-gray-400"><span class="marker-text">📍</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      L.marker([-7.919021, 113.820801], { icon: defaultIcon })
        .bindPopup('Pusat Wilayah Prajekan')
        .addTo(markerLayerRef.current);
      
      return;
    }

    // Buat marker
    filteredData.forEach(item => {
      if (!item.lat || !item.lng) return;

      const markerColor = getMarkerColor(item);
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-pin ${markerColor}">
            <span class="marker-text">${item.jenis === 'masuk' ? 'M' : 'P'}</span>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      const popupContent = `
        <div style="min-width: 250px; padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 8px;">${item.nama || 'Tanpa Nama'}</div>
          <div style="font-size: 12px; color: #666;">
            <div>${item.jabatan || '-'}</div>
            <div>${item.wilayah_penugasan}</div>
            <div>${item.jam ? item.jam.substring(0,5) : '-'} - ${getStatusText(item)}</div>
          </div>
        </div>
      `;

      L.marker([item.lat, item.lng], { icon: customIcon })
        .bindPopup(popupContent)
        .on('click', () => setSelectedPresensi(item))
        .addTo(markerLayerRef.current);
    });

  }, [presensiList, searchTerm, filterWilayah, isMapReady]);

  // Helper functions
  const getMarkerColor = (item) => {
    if (item.jenis === 'masuk') {
      return item.status === 'Terlambat' ? 'bg-yellow-500' : 'bg-blue-500';
    } else {
      return item.is_lembur ? 'bg-purple-500' : 'bg-green-500';
    }
  };

  const getStatusText = (item) => {
    if (item.izin_id) return 'Izin';
    if (!item.jam) return 'Belum Presensi';
    if (item.status === 'Terlambat') return 'Terlambat';
    if (item.status === 'Tepat Waktu') return 'Tepat Waktu';
    return item.status || 'Presensi';
  };

  const formatTanggal = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  };

  const handlePrevDay = () => {
    if (!filterTanggal) return;
    const date = new Date(filterTanggal);
    date.setDate(date.getDate() - 1);
    setFilterTanggal(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    if (!filterTanggal) return;
    const date = new Date(filterTanggal);
    date.setDate(date.getDate() + 1);
    setFilterTanggal(date.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFilterTanggal(today);
  };

  const resetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([-7.919021, 113.820801], 11);
    }
    setSelectedPresensi(null);
  };

  const filteredPresensi = presensiList.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWilayah = filterWilayah === '' || item.wilayah_penugasan === filterWilayah;
    return matchesSearch && matchesWilayah;
  });

  if (loading && !presensiList.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Memuat data presensi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-500" />
            <button
              onClick={handlePrevDay}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={18} />
            </button>
            
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            />
            
            <button
              onClick={handleNextDay}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={18} />
            </button>
            
            <button
              onClick={handleToday}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 ml-2"
            >
              Hari Ini
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari pegawai..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm w-64"
              />
            </div>

            <button
              onClick={resetView}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              title="Reset Peta"
            >
              <Home size={16} />
            </button>

            <button
              onClick={() => fetchPresensiData(filterTanggal)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Statistik */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Users size={14} /> Total: {stats.total}
          </span>
          <span className="text-sm text-green-600 flex items-center gap-1">
            <UserCheck size={14} /> Hadir: {stats.hadir}
          </span>
          <span className="text-sm text-yellow-600 flex items-center gap-1">
            <Clock size={14} /> Terlambat: {stats.terlambat}
          </span>
          <span className="text-sm text-purple-600 flex items-center gap-1">
            <Briefcase size={14} /> Izin: {stats.izin}
          </span>
          <span className="text-sm text-red-600 flex items-center gap-1">
            <UserX size={14} /> Alpha: {stats.tanpaKeterangan}
          </span>
          <span className="text-sm text-blue-600 flex items-center gap-1">
            <MapPin size={14} /> Dengan Lokasi: {stats.denganLokasiMasuk + stats.denganLokasiPulang}
          </span>
        </div>

        {/* Filter Wilayah */}
        {wilayahList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-gray-500">Filter Wilayah:</span>
            <button
              onClick={() => setFilterWilayah('')}
              className={`px-2 py-1 rounded-lg text-xs ${
                filterWilayah === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            {wilayahList.map(wilayah => (
              <button
                key={wilayah}
                onClick={() => setFilterWilayah(wilayah)}
                className={`px-2 py-1 rounded-lg text-xs ${
                  filterWilayah === wilayah 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {wilayah}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {!isMapReady ? (
          <div className="h-[600px] flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <div className="relative h-[600px]">
            <div ref={mapRef} className="w-full h-full" />

            {/* Info Panel */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
              <p className="text-sm font-medium">
                {filteredPresensi.length} Lokasi Ditampilkan
              </p>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Masuk</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Pulang</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Terlambat</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Lembur</span>
                </div>
              </div>
            </div>

            {/* Selected Info */}
            {selectedPresensi && (
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 w-80">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold">{selectedPresensi.nama}</h3>
                  <button
                    onClick={() => setSelectedPresensi(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Jabatan:</span> {selectedPresensi.jabatan}</p>
                  <p><span className="text-gray-500">Wilayah:</span> {selectedPresensi.wilayah_penugasan}</p>
                  <p><span className="text-gray-500">Waktu:</span> {selectedPresensi.jam?.substring(0,5)}</p>
                  <p><span className="text-gray-500">Status:</span> {getStatusText(selectedPresensi)}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Daftar Pegawai (Mobile) */}
      <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold mb-3">Daftar Pegawai</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {allPresensiData.map(item => (
            <div key={item.id} className="p-2 bg-gray-50 rounded-lg text-sm">
              <div className="font-medium">{item.nama}</div>
              <div className="text-xs text-gray-500">
                {item.wilayah_penugasan} • {item.jam_masuk?.substring(0,5) || 'Belum masuk'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          position: relative;
          transform: rotate(-45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-pin.bg-blue-500 { background: #3b82f6; }
        .marker-pin.bg-green-500 { background: #10b981; }
        .marker-pin.bg-yellow-500 { background: #f59e0b; }
        .marker-pin.bg-purple-500 { background: #8b5cf6; }
        .marker-pin.bg-gray-400 { background: #9ca3af; }
        .marker-text {
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}