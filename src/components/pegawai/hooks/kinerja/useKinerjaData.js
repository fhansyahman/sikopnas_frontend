"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { kinerjaAPI } from "@/lib/api";

export function useKinerjaData() {
  const [kinerjaList, setKinerjaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [searchTerm, setSearchTerm] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [periodeInfo, setPeriodeInfo] = useState(null);
  const [stats, setStats] = useState({
    total_laporan: 0,
    total_panjang: 0,
    avg_panjang: 0,
    presentase_kehadiran: 0
  });
  const [chartData, setChartData] = useState(null);

  const loadKinerja = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await kinerjaAPI.getMyKinerjaPerBulan({
        bulan: selectedMonth,
        tahun: selectedYear
      });
      
      if (response.data.success) {
        const data = response.data.data;
        setKinerjaList(data.kinerja || []);
        setStats(data.stats);
        setPeriodeInfo(data.periode);
        setChartData(data.charts);
        
        // Extract available years
        if (data.kinerja && data.kinerja.length > 0) {
          const years = new Set();
          data.kinerja.forEach(item => {
            if (item.tahun) years.add(item.tahun.toString());
          });
          const currentYear = new Date().getFullYear();
          years.add(currentYear.toString());
          setAvailableYears(Array.from(years).sort((a, b) => b - a));
        } else {
          setAvailableYears([selectedYear]);
        }
      } else {
        throw new Error(response.data.message || 'Gagal memuat data kinerja');
      }
    } catch (error) {
      let errorMessage = 'Gagal memuat data kinerja';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error: Terjadi masalah pada server. Silakan coba lagi.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadKinerja();
  }, [loadKinerja]);

  const handleEdit = (id) => {
    const item = kinerjaList.find(kinerja => kinerja.id === id);
    return item || null;
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus laporan kinerja ini?")) return false;

    try {
      setLoading(true);
      const response = await kinerjaAPI.delete(id);

      if (response.data.success) {
        await loadKinerja();
        alert('Laporan kinerja berhasil dihapus');
        return true;
      } else {
        throw new Error(response.data.message || 'Gagal menghapus data');
      }
    } catch (error) {
      let errorMessage = 'Gagal menghapus laporan kinerja';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error: Terjadi masalah pada server. Silakan coba lagi.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const filteredKinerja = useMemo(() => {
    return kinerjaList.filter(kinerja => {
      return kinerja.ruas_jalan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             kinerja.kegiatan?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [kinerjaList, searchTerm]);

  const efficiency = useMemo(() => {
    return stats.presentase_kehadiran || 0;
  }, [stats.presentase_kehadiran]);

  // Navigasi bulan
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

  const goToCurrentMonth = useCallback(() => {
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear().toString();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, []);

  const getMonthName = useCallback((monthNumber) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[parseInt(monthNumber) - 1] || '';
  }, []);

  return {
    loading,
    kinerjaList,
    filteredKinerja,
    stats,
    efficiency,
    selectedMonth,
    selectedYear,
    searchTerm,
    availableYears,
    periodeInfo,
    chartData,
    error,
    setSelectedMonth,
    setSelectedYear,
    setSearchTerm,
    loadKinerja,
    handleEdit,
    handleDelete,
    formatDate,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    getMonthName
  };
}