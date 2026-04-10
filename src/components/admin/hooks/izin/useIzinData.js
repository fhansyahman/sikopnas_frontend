"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import { izinAPI } from "@/lib/api";
import { DateTime } from "luxon";

export function useIzinData() {
  const [izinList, setIzinList] = useState([]);
  const [statistik, setStatistik] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [search, setSearch] = useState("");
  
  // STATE BARU UNTUK FILTER PER TANGGAL
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate());
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [tanggalInfo, setTanggalInfo] = useState(null);

  // Fungsi untuk statistik kosong
  const getEmptyStatistik = useCallback(() => ({
    total_pengajuan: 0,
    pending: 0,
    disetujui: 0,
    ditolak: 0,
    sakit: 0,
    izin: 0,
    dinas_luar: 0,
    persen_disetujui: 0,
    persen_ditolak: 0,
    persen_pending: 0,
    chart_data: {
      labels: ['Disetujui', 'Ditolak', 'Pending'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
        borderColor: ['#0DA675', '#DC2626', '#D97706'],
        borderWidth: 1
      }]
    }
  }), []);

  // Hitung statistik dari data
  const calculateStatistik = useCallback((data) => {
    if (!data || data.length === 0) {
      setStatistik(getEmptyStatistik());
      return;
    }

    const totalPengajuan = data.length;
    const pending = data.filter(i => i.status === 'Pending').length;
    const disetujui = data.filter(i => i.status === 'Disetujui').length;
    const ditolak = data.filter(i => i.status === 'Ditolak').length;
    
    // Hitung berdasarkan jenis izin yang baru
    const sakit = data.filter(i => i.jenis === 'Sakit').length;
    const izin = data.filter(i => i.jenis === 'Izin').length;
    const dinasLuar = data.filter(i => i.jenis === 'Dinas Luar').length;
    
    const persenDisetujui = totalPengajuan > 0 ? Math.round((disetujui / totalPengajuan) * 100) : 0;
    const persenDitolak = totalPengajuan > 0 ? Math.round((ditolak / totalPengajuan) * 100) : 0;
    const persenPending = totalPengajuan > 0 ? Math.round((pending / totalPengajuan) * 100) : 0;
    
    // Statistik per wilayah
    const wilayahStatistik = {};
    data.forEach(izin => {
      const wilayah = izin.wilayah_penugasan || 'Unknown';
      if (!wilayahStatistik[wilayah]) {
        wilayahStatistik[wilayah] = { total: 0, pending: 0, disetujui: 0, ditolak: 0 };
      }
      wilayahStatistik[wilayah].total++;
      if (izin.status === 'Pending') wilayahStatistik[wilayah].pending++;
      if (izin.status === 'Disetujui') wilayahStatistik[wilayah].disetujui++;
      if (izin.status === 'Ditolak') wilayahStatistik[wilayah].ditolak++;
    });
    
    setStatistik({
      total_pengajuan: totalPengajuan,
      pending,
      disetujui,
      ditolak,
      sakit,
      izin,
      dinas_luar: dinasLuar,
      persen_disetujui: persenDisetujui,
      persen_ditolak: persenDitolak,
      persen_pending: persenPending,
      wilayah: wilayahStatistik,
      chart_data: {
        labels: ['Disetujui', 'Ditolak', 'Pending'],
        datasets: [{
          data: [disetujui, ditolak, pending],
          backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
          borderColor: ['#0DA675', '#DC2626', '#D97706'],
          borderWidth: 1
        }]
      }
    });
  }, [getEmptyStatistik]);

  // MODIFIKASI: Load data izin per tanggal (bukan all)
  const loadIzinData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Gunakan endpoint per-tanggal dengan parameter yang ada
      const params = {
        tanggal: filters.tanggal || selectedDate,
        status: filters.status || selectedStatus,
        jenis: filters.jenis || selectedJenis,
        search: filters.search || search
      };
      
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      console.log('Loading izin per tanggal dengan params:', params);
      const response = await izinAPI.getIzinPerTanggal(params);
      
      if (response.data.success) {
        const data = response.data.data;
        setIzinList(data.izin || []);
        setStatistik(data.statistik || getEmptyStatistik());
        setTanggalInfo({
          tanggal: data.tanggal,
          tanggal_formatted: data.tanggal_formatted,
          hari: data.hari,
          total: data.total
        });
      } else {
        throw new Error(response.data.message || 'Gagal memuat data');
      }
      
    } catch (error) {
      console.error('Error loading izin:', error);
      setError('Gagal memuat data izin');
      setIzinList([]);
      setStatistik(getEmptyStatistik());
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedStatus, selectedJenis, search, getEmptyStatistik]);

  // FUNGSI BARU: Handle date change
  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
    loadIzinData({ tanggal: newDate, status: selectedStatus, jenis: selectedJenis, search });
  }, [selectedStatus, selectedJenis, search, loadIzinData]);

  // FUNGSI BARU: Handle status filter change
  const handleStatusChange = useCallback((newStatus) => {
    setSelectedStatus(newStatus);
    loadIzinData({ tanggal: selectedDate, status: newStatus, jenis: selectedJenis, search });
  }, [selectedDate, selectedJenis, search, loadIzinData]);

  // FUNGSI BARU: Handle jenis filter change
  const handleJenisChange = useCallback((newJenis) => {
    setSelectedJenis(newJenis);
    loadIzinData({ tanggal: selectedDate, status: selectedStatus, jenis: newJenis, search });
  }, [selectedDate, selectedStatus, search, loadIzinData]);

  // FUNGSI BARU: Handle search
  const handleSearch = useCallback((newSearch) => {
    setSearch(newSearch);
    loadIzinData({ tanggal: selectedDate, status: selectedStatus, jenis: selectedJenis, search: newSearch });
  }, [selectedDate, selectedStatus, selectedJenis, loadIzinData]);

  // FUNGSI BARU: Reset semua filter
  const resetFilters = useCallback(() => {
    setSelectedStatus("");
    setSelectedJenis("");
    setSearch("");
    loadIzinData({ tanggal: selectedDate, status: "", jenis: "", search: "" });
  }, [selectedDate, loadIzinData]);

  // FUNGSI BARU: Go to previous day
  const goToPreviousDay = useCallback(() => {
    const newDate = DateTime.fromISO(selectedDate).minus({ days: 1 }).toISODate();
    handleDateChange(newDate);
  }, [selectedDate, handleDateChange]);

  // FUNGSI BARU: Go to next day
  const goToNextDay = useCallback(() => {
    const newDate = DateTime.fromISO(selectedDate).plus({ days: 1 }).toISODate();
    handleDateChange(newDate);
  }, [selectedDate, handleDateChange]);

  // FUNGSI BARU: Go to today
  const goToToday = useCallback(() => {
    const today = DateTime.now().toISODate();
    handleDateChange(today);
  }, [handleDateChange]);

  // Initial load - gunakan tanggal hari ini
  useEffect(() => {
    loadIzinData({ tanggal: selectedDate });
  }, []);

  // Handle update status single (tetap sama)
  const handleUpdateStatus = useCallback(async (id, status) => {
    try {
      await izinAPI.updateStatus(id, status);
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Izin berhasil ${status === 'Disetujui' ? 'disetujui' : 'ditolak'}`,
        confirmButtonText: "Oke",
        confirmButtonColor: "#10B981",
      });
      
      await loadIzinData();
    } catch (error) {
      console.error('Error updating izin status:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || `Gagal ${status === 'Disetujui' ? 'menyetujui' : 'menolak'} izin`,
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  }, [loadIzinData]);

  // Handle bulk action (tetap sama)
  const handleBulkAction = useCallback(async (action, items) => {
    if (!action || items.length === 0) return;
    
    setIsProcessing(true);
    try {
      const promises = items.map(id => izinAPI.updateStatus(id, action));
      await Promise.all(promises);
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `${items.length} izin berhasil ${action === 'Disetujui' ? 'disetujui' : 'ditolak'}`,
        confirmButtonText: "Oke",
        confirmButtonColor: "#10B981",
      });
      
      await loadIzinData();
    } catch (error) {
      console.error('Error bulk updating izin status:', error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.response?.data?.message || `Gagal ${action === 'Disetujui' ? 'menyetujui' : 'menolak'} izin`,
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [loadIzinData]);

  // Filtered data based on search (already filtered in backend, but for safety)
  const filteredIzin = useMemo(() => {
    if (!search) return izinList;
    
    return izinList.filter((izin) =>
      izin.nama_pegawai?.toLowerCase().includes(search.toLowerCase()) ||
      izin.jenis?.toLowerCase().includes(search.toLowerCase()) ||
      izin.keterangan?.toLowerCase().includes(search.toLowerCase()) ||
      izin.wilayah_penugasan?.toLowerCase().includes(search.toLowerCase())
    );
  }, [izinList, search]);

  // Options untuk filter status
  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "Pending", label: "Pending" },
    { value: "Disetujui", label: "Disetujui" },
    { value: "Ditolak", label: "Ditolak" }
  ];

  // Options untuk filter jenis
  const jenisOptions = [
    { value: "", label: "Semua Jenis" },
    { value: "Sakit", label: "Sakit" },
    { value: "Izin", label: "Izin" },
    { value: "Dinas Luar", label: "Dinas Luar" }
  ];

  return {
    izinList,
    statistik,
    loading,
    error,
    filteredIzin,
    isProcessing,
    search,
    selectedDate,
    selectedStatus,
    selectedJenis,
    tanggalInfo,
    statusOptions,
    jenisOptions,
    setSearch: handleSearch,
    setSelectedDate: handleDateChange,
    setSelectedStatus: handleStatusChange,
    setSelectedJenis: handleJenisChange,
    loadIzinData,
    handleUpdateStatus,
    handleBulkAction,
    resetFilters,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    setIzinList
  };
}