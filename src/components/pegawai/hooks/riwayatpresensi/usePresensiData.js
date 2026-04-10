"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { presensiAPI } from "@/lib/api";

export function usePresensiData() {
  const [allPresensi, setAllPresensi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentMonthStats, setCurrentMonthStats] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [expandedDays, setExpandedDays] = useState({});
  const [periodeInfo, setPeriodeInfo] = useState(null);
  
  const router = useRouter();

  // Fetch data presensi berdasarkan bulan dan tahun dari endpoint /perbulan
  const fetchDataPresensi = useCallback(async (bulan, tahun) => {
    try {
      setLoading(true);
      setError('');
      
      // Gunakan endpoint baru /perbulan
      const targetBulan = bulan || selectedMonth || (new Date().getMonth() + 1).toString().padStart(2, '0');
      const targetTahun = tahun || selectedYear || new Date().getFullYear().toString();
      
      console.log(`Fetching presensi per bulan: ${targetBulan}/${targetTahun}`);
      const response = await presensiAPI.getUserPerBulan(targetBulan, targetTahun);
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Data dari API sudah sesuai dengan bulan yang dipilih
        setFilteredData(data.presensi || []);
        setCurrentMonthStats(data.stats);
        setPeriodeInfo(data.periode);
        
        // Set available years untuk filter (dari API)
        if (data.filters?.years) {
          setAvailableYears(data.filters.years);
        } else {
          // Fallback years
          const currentYear = new Date().getFullYear();
          setAvailableYears([
            { value: "", label: "Semua Tahun" },
            { value: currentYear.toString(), label: currentYear.toString() },
            { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() }
          ]);
        }
        
        // Set available months (static)
        const monthsData = [
          { value: "01", label: "Januari" },
          { value: "02", label: "Februari" },
          { value: "03", label: "Maret" },
          { value: "04", label: "April" },
          { value: "05", label: "Mei" },
          { value: "06", label: "Juni" },
          { value: "07", label: "Juli" },
          { value: "08", label: "Agustus" },
          { value: "09", label: "September" },
          { value: "10", label: "Oktober" },
          { value: "11", label: "November" },
          { value: "12", label: "Desember" }
        ];
        setAvailableMonths(monthsData);
        
        // Update selected month/year state
        setSelectedMonth(targetBulan);
        setSelectedYear(targetTahun);
        
        // Konversi allPresensi untuk kompatibilitas dengan komponen lain
        // (untuk keperluan filter dan statistik)
        setAllPresensi(data.presensi || []);
        
      } else {
        setError(response.data.message || 'Gagal mengambil data presensi');
      }
    } catch (err) {
      console.error("Error fetching presensi:", err);
      if (err.response?.status === 401) {
        setError('Sesi telah berakhir. Silakan login kembali.');
        router.push('/login');
      } else {
        setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data');
      }
    } finally {
      setLoading(false);
    }
  }, [router, selectedMonth, selectedYear]);

  // Initial fetch - bulan/tahun saat ini
  useEffect(() => {
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear().toString();
    fetchDataPresensi(currentMonth, currentYear);
  }, []); // Hanya sekali saat mount

  // Fetch ulang ketika bulan atau tahun berubah
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchDataPresensi(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]); // Re-fetch ketika filter berubah

  // Fungsi untuk menentukan status akhir (jika tidak ada dari API)
  const getStatusAkhir = useCallback((presensi) => {
    if (presensi.status_akhir) return presensi.status_akhir;
    
    if (presensi.keterangan?.includes('PEMUTIHAN') || 
        presensi.keterangan?.includes('pemutihan') ||
        presensi.keterangan?.includes('Jangan lupa presensi')) {
      return 'Hadir (Pemutihan)';
    }
    
    if (presensi.izin_id) {
      return presensi.jenis_izin === 'sakit' ? 'Sakit' : 'Izin';
    } else if (presensi.status_masuk === 'Tanpa Keterangan' || presensi.status_pulang === 'Tanpa Keterangan') {
      return 'Tanpa Keterangan';
    } else if (presensi.status_masuk === 'Tepat Waktu' && presensi.jam_pulang) {
      return 'Hadir';
    } else if (presensi.status_masuk && presensi.status_masuk.includes('Terlambat')) {
      return 'Terlambat';
    } else if (presensi.jam_masuk && !presensi.jam_pulang) {
      return 'Belum Pulang';
    } else if (!presensi.jam_masuk && !presensi.jam_pulang) {
      return 'Tanpa Keterangan';
    }
    return 'Tidak Diketahui';
  }, []);

  // Statistik sudah dari API, tapi kita tetap hitung ulang untuk konsistensi
  const calculateStats = useCallback(() => {
    // Jika ada currentMonthStats dari API, gunakan itu
    if (currentMonthStats && Object.keys(currentMonthStats).length > 0) {
      return currentMonthStats;
    }
    
    // Fallback: hitung manual
    const stats = {
      total_hari_kerja: 0,
      total_presensi: filteredData.length,
      hadir: 0,
      hadir_pemutihan: 0,
      tepat_waktu: 0,
      terlambat: 0,
      terlambat_berat: 0,
      izin: 0,
      sakit: 0,
      tanpa_keterangan: 0,
      lembur: 0,
      belum_pulang: 0,
      presentase_kehadiran: 0
    };

    filteredData.forEach(p => {
      const statusAkhir = p.status_akhir || getStatusAkhir(p);
      
      switch (statusAkhir) {
        case 'Hadir':
          stats.hadir++;
          if (p.status_masuk === 'Tepat Waktu') stats.tepat_waktu++;
          if (p.is_lembur) stats.lembur++;
          break;
        case 'Hadir (Pemutihan)':
          stats.hadir++;
          stats.hadir_pemutihan++;
          if (p.status_masuk === 'Tepat Waktu') stats.tepat_waktu++;
          break;
        case 'Terlambat':
          stats.hadir++;
          stats.terlambat++;
          if (p.status_masuk === 'Terlambat Berat') stats.terlambat_berat++;
          if (p.is_lembur) stats.lembur++;
          break;
        case 'Izin':
          stats.izin++;
          break;
        case 'Sakit':
          stats.sakit++;
          break;
        case 'Tanpa Keterangan':
          stats.tanpa_keterangan++;
          break;
        case 'Belum Pulang':
          stats.belum_pulang++;
          stats.hadir++;
          break;
      }
    });

    stats.total_presensi = filteredData.length;
    if (stats.total_hari_kerja > 0) {
      stats.presentase_kehadiran = Math.round((stats.hadir / stats.total_hari_kerja) * 100);
    }

    return stats;
  }, [filteredData, getStatusAkhir, currentMonthStats]);

  const stats = useMemo(() => calculateStats(), [calculateStats]);
  
  const presentase = useMemo(() => 
    stats.presentase_kehadiran || 0, 
    [stats.presentase_kehadiran]
  );

  // Utility functions
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "Hadir": return "bg-green-100 text-green-700 border-green-200";
      case "Hadir (Pemutihan)": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Terlambat": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Tanpa Keterangan": return "bg-gray-100 text-gray-700 border-gray-200";
      case "Izin": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Sakit": return "bg-pink-100 text-pink-700 border-pink-200";
      case "Belum Pulang": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    const icons = {
      "Hadir": "✅",
      "Hadir (Pemutihan)": "📝",
      "Terlambat": "⏰",
      "Tanpa Keterangan": "❌",
      "Izin": "📋",
      "Sakit": "🤒",
      "Lembur": "📈",
      "Belum Pulang": "⚠️",
    };
    return icons[status] || "❓";
  }, []);

  const formatDate = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString || "Tanggal tidak valid";
    }
  }, []);

  const formatDayOnly = useCallback((dateString) => {
    try {
      return new Date(dateString).getDate();
    } catch {
      return dateString?.split('-')[2] || "?";
    }
  }, []);

  const formatDayName = useCallback((dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", { weekday: "short" });
    } catch {
      return "";
    }
  }, []);

  const formatTime = useCallback((timeString) => {
    if (!timeString) return "—";
    return timeString.split(':').slice(0, 2).join(':');
  }, []);

  const toggleDayDetail = useCallback((id) => {
    setExpandedDays(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const resetFilter = useCallback(() => {
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear().toString();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, []);

  const setToCurrentMonth = useCallback(() => {
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear().toString();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, []);

  const getMonthName = useCallback((monthValue) => {
    const month = availableMonths.find(m => m.value === monthValue);
    return month ? month.label : monthValue;
  }, [availableMonths]);

  const goToPreviousMonth = useCallback(() => {
    let newMonth = parseInt(selectedMonth) - 1;
    let newYear = parseInt(selectedYear);
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    setSelectedMonth(newMonth.toString().padStart(2, '0'));
    setSelectedYear(newYear.toString());
  }, [selectedMonth, selectedYear]);

  const goToNextMonth = useCallback(() => {
    let newMonth = parseInt(selectedMonth) + 1;
    let newYear = parseInt(selectedYear);
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    
    setSelectedMonth(newMonth.toString().padStart(2, '0'));
    setSelectedYear(newYear.toString());
  }, [selectedMonth, selectedYear]);

  // Generate months list
  const months = useMemo(() => 
    availableMonths.length > 0 ? availableMonths : [
      { value: "01", label: "Januari" },
      { value: "02", label: "Februari" },
      { value: "03", label: "Maret" },
      { value: "04", label: "April" },
      { value: "05", label: "Mei" },
      { value: "06", label: "Juni" },
      { value: "07", label: "Juli" },
      { value: "08", label: "Agustus" },
      { value: "09", label: "September" },
      { value: "10", label: "Oktober" },
      { value: "11", label: "November" },
      { value: "12", label: "Desember" }
    ], [availableMonths]);

  return {
    loading,
    error,
    allPresensi,
    filteredData,
    stats,
    presentase,
    selectedMonth,
    selectedYear,
    availableMonths,
    availableYears,
    expandedDays,
    currentMonthStats,
    periodeInfo,
    setSelectedMonth,
    setSelectedYear,
    resetFilter,
    setToCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    toggleDayDetail,
    fetchDataPresensi,
    getStatusAkhir,
    getStatusColor,
    getStatusIcon,
    formatDate,
    formatDayOnly,
    formatDayName,
    formatTime,
    getMonthName,
    months
  };
}