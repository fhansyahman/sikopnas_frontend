'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminKinerjaAPI } from '@/lib/api';

export function useKinerjaData() {
  const [kinerjaList, setKinerjaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWilayah, setSelectedWilayah] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  
  // Default statistik yang aman
  const defaultStatistik = {
    total_laporan: 0,
    total_pegawai: 0,
    total_panjang_kr: 0,
    total_panjang_kn: 0,
    avg_panjang_kr: 0,
    avg_panjang_kn: 0,
    wilayah: {}
  };
  
  const [statistik, setStatistik] = useState(defaultStatistik);
  const [tanggalInfo, setTanggalInfo] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Format tanggal
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }, []);

  const formatDateShort = useCallback((dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }, []);

  // Load data kinerja per tanggal
  const loadKinerjaData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        tanggal: selectedDate
      };
      
      if (selectedWilayah && selectedWilayah !== '') {
        params.wilayah = selectedWilayah;
      }
      
      if (search && search !== '') {
        params.search = search;
      }
      
      console.log('Loading kinerja per tanggal:', params);
      const response = await adminKinerjaAPI.getPerTanggal(params);
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        setKinerjaList(data.kinerja || []);
        
        // Set statistik dengan nilai default yang aman
        const safeStatistik = {
          total_laporan: data.statistik?.total_laporan || 0,
          total_pegawai: data.statistik?.total_pegawai || 0,
          total_panjang_kr: data.statistik?.total_panjang_kr || 0,
          total_panjang_kn: data.statistik?.total_panjang_kn || 0,
          avg_panjang_kr: data.statistik?.avg_panjang_kr || 0,
          avg_panjang_kn: data.statistik?.avg_panjang_kn || 0,
          wilayah: data.statistik?.wilayah || {}
        };
        
        setStatistik(safeStatistik);
        setTanggalInfo({
          tanggal: data.tanggal || selectedDate,
          tanggal_formatted: data.tanggal_formatted || formatDate(selectedDate),
          hari: data.hari || ''
        });
        setChartData(data.charts || null);
      } else {
        throw new Error(response.data?.message || 'Gagal memuat data');
      }
      
    } catch (error) {
      console.error('Error loading kinerja:', error);
      setError(error.response?.data?.message || error.message || 'Gagal memuat data kinerja');
      setKinerjaList([]);
      setStatistik(defaultStatistik);
      setTanggalInfo(null);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedWilayah, selectedDate, search, formatDate]);

  // Load data saat filter berubah
  useEffect(() => {
    loadKinerjaData();
  }, [loadKinerjaData]);

  // Reset filter
  const handleResetFilters = useCallback(() => {
    setSelectedWilayah('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSearch('');
  }, []);

  // Navigasi tanggal
  const goToPreviousDate = useCallback(() => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  const goToNextDate = useCallback(() => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Group data by wilayah for rekap view
  const groupedByWilayah = useMemo(() => {
    if (!kinerjaList || kinerjaList.length === 0) return {};
    
    return kinerjaList.reduce((groups, item) => {
      const wilayah = item.wilayah_penugasan || 'Tidak Ditentukan';
      if (!groups[wilayah]) {
        groups[wilayah] = [];
      }
      groups[wilayah].push(item);
      return groups;
    }, {});
  }, [kinerjaList]);

  // Format panjang
  const formatPanjang = useCallback((value) => {
    const num = parseFloat(value) || 0;
    if (num === 0) return '0 meter';
    return `${num} meter`;
  }, []);

  return {
    kinerjaList,
    loading,
    error,
    statistik,
    selectedWilayah,
    selectedDate,
    search,
    tanggalInfo,
    chartData,
    setSelectedWilayah,
    setSelectedDate,
    setSearch,
    handleResetFilters,
    loadKinerjaData,
    formatDate,
    formatDateShort,
    formatPanjang,
    groupedByWilayah,
    goToPreviousDate,
    goToNextDate,
    goToToday
  };
}