"use client";

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { adminKinerjaAPI } from "@/lib/api";

export function useKinerjaData(search = "") {
  const [kinerjaList, setKinerjaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWilayah, setSelectedWilayah] = useState("");
  const [tanggalInfo, setTanggalInfo] = useState(null);
  const [statistik, setStatistik] = useState({
    total_laporan: 0,
    total_pegawai: 0,
    total_panjang_kr: 0,
    total_panjang_kn: 0,
    avg_panjang_kr: 0,
    avg_panjang_kn: 0,
    wilayah: {},
    chart_data: {
      labels: [],
      datasets: [{ data: [] }]
    }
  });

  // Hitung statistik dari data
  const calculateStatistikFromData = useCallback((data) => {
    if (!data || data.length === 0) {
      return {
        total_laporan: 0,
        total_pegawai: 0,
        total_panjang_kr: 0,
        total_panjang_kn: 0,
        avg_panjang_kr: 0,
        avg_panjang_kn: 0,
        wilayah: {},
        chart_data: {
          labels: [],
          datasets: [{ data: [] }]
        }
      };
    }

    const totalLaporan = data.length;
    const uniquePegawai = [...new Set(data.map(item => item.user_id || item.nama))].length;
    
    // Hitung total panjang
    const totalPanjangKR = data.reduce((sum, item) => sum + (parseFloat(item.panjang_kr) || 0), 0);
    const totalPanjangKN = data.reduce((sum, item) => sum + (parseFloat(item.panjang_kn) || 0), 0);
    
    // Hitung rata-rata
    const avgPanjangKR = totalLaporan > 0 ? totalPanjangKR / totalLaporan : 0;
    const avgPanjangKN = totalLaporan > 0 ? totalPanjangKN / totalLaporan : 0;
    
    // Statistik per wilayah
    const wilayahStatistik = {};
    data.forEach(item => {
      const wilayah = item.wilayah_penugasan || 'Unknown';
      
      if (!wilayahStatistik[wilayah]) {
        wilayahStatistik[wilayah] = {
          total: 0,
          total_kr: 0,
          total_kn: 0,
          avg_kr: 0,
          avg_kn: 0,
          total_pegawai: new Set()
        };
      }
      
      wilayahStatistik[wilayah].total++;
      wilayahStatistik[wilayah].total_kr += parseFloat(item.panjang_kr) || 0;
      wilayahStatistik[wilayah].total_kn += parseFloat(item.panjang_kn) || 0;
      wilayahStatistik[wilayah].total_pegawai.add(item.user_id || item.nama);
    });
    
    // Hitung rata-rata per wilayah
    Object.keys(wilayahStatistik).forEach(wilayah => {
      const w = wilayahStatistik[wilayah];
      w.avg_kr = w.total > 0 ? w.total_kr / w.total : 0;
      w.avg_kn = w.total > 0 ? w.total_kn / w.total : 0;
      w.total_pegawai = w.total_pegawai.size;
    });
    
    return {
      total_laporan: totalLaporan,
      total_pegawai: uniquePegawai,
      total_panjang_kr: parseFloat(totalPanjangKR.toFixed(2)),
      total_panjang_kn: parseFloat(totalPanjangKN.toFixed(2)),
      avg_panjang_kr: parseFloat(avgPanjangKR.toFixed(2)),
      avg_panjang_kn: parseFloat(avgPanjangKN.toFixed(2)),
      wilayah: wilayahStatistik,
      chart_data: {
        labels: Object.keys(wilayahStatistik),
        datasets: [{
          data: Object.values(wilayahStatistik).map(w => w.total),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
          borderColor: ['#1D4ED8', '#0DA675', '#D97706', '#DC2626', '#6D28D9'],
          borderWidth: 1
        }]
      }
    };
  }, []);

  // Load data per tanggal
  const loadKinerjaData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const requestParams = {
        tanggal: params.tanggal || selectedDate,
        wilayah: params.wilayah || selectedWilayah,
        search: params.search || search
      };
      
      // Remove empty params
      Object.keys(requestParams).forEach(key => {
        if (!requestParams[key]) delete requestParams[key];
      });
      
      console.log('Loading kinerja per tanggal:', requestParams);
      const response = await adminKinerjaAPI.getPerTanggal(requestParams);
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        const kinerjaData = data.kinerja || [];
        
        setKinerjaList(kinerjaData);
        
        // Hitung statistik dari data yang diterima
        const calculatedStats = calculateStatistikFromData(kinerjaData);
        setStatistik(calculatedStats);
        
        setTanggalInfo({
          tanggal: data.tanggal,
          tanggal_formatted: data.tanggal_formatted,
          hari: data.hari
        });
        
        console.log('Calculated stats:', calculatedStats);
      } else {
        throw new Error(response.data.message || 'Gagal memuat data');
      }
      
    } catch (error) {
      console.error('Error loading kinerja:', error);
      setError('Gagal memuat data kinerja');
      setKinerjaList([]);
      setStatistik(calculateStatistikFromData([]));
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedWilayah, search, calculateStatistikFromData]);

  // Initial load
  useEffect(() => {
    loadKinerjaData();
  }, []);

  // Reload when date or wilayah changes
  useEffect(() => {
    loadKinerjaData();
  }, [selectedDate, selectedWilayah]);

  // Filtered data
  const filteredKinerja = kinerjaList;

  // Delete single item
  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Data Kinerja?',
      text: 'Data yang dihapus tidak dapat dikembalikan',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    });

    if (result.isConfirmed) {
      try {
        await adminKinerjaAPI.delete(id);
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data kinerja berhasil dihapus',
          confirmButtonText: 'Oke',
          confirmButtonColor: '#10B981',
        });
        
        loadKinerjaData();
        setSelectedItems(prev => prev.filter(item => item !== id));
      } catch (error) {
        console.error('Error deleting kinerja:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response?.data?.message || 'Gagal menghapus kinerja',
          confirmButtonText: 'Tutup',
          confirmButtonColor: '#EF4444',
        });
      }
    }
  }, [loadKinerjaData]);

  // Bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedItems.length === 0) return;

    const result = await Swal.fire({
      title: `Hapus ${selectedItems.length} Laporan?`,
      text: `Yakin ingin menghapus ${selectedItems.length} laporan kinerja?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Ya, Hapus`,
      cancelButtonText: "Batal",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (result.isConfirmed) {
      setIsProcessing(true);
      try {
        const promises = selectedItems.map(id => adminKinerjaAPI.delete(id));
        await Promise.all(promises);
        
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `${selectedItems.length} laporan berhasil dihapus`,
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
        
        loadKinerjaData();
        setSelectedItems([]);
      } catch (error) {
        console.error('Error bulk delete:', error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.response?.data?.message || 'Gagal menghapus laporan',
          confirmButtonText: "Tutup",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  }, [selectedItems, loadKinerjaData]);

  return {
    kinerjaList: filteredKinerja,
    filteredKinerja,
    loading,
    error,
    statistik,
    selectedItems,
    selectedDate,
    selectedWilayah,
    tanggalInfo,
    setSelectedItems,
    setSelectedDate,
    setSelectedWilayah,
    isProcessing,
    loadKinerjaData,
    handleDelete,
    handleBulkDelete
  };
}