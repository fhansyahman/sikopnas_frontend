"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { hariAPI } from "@/lib/api";
import Swal from "sweetalert2";

export function useHariData() {
  const [hariKerjaList, setHariKerjaList] = useState([]);
  const [hariLiburList, setHariLiburList] = useState([]);
  const [kalender, setKalender] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHariKerjaModal, setShowHariKerjaModal] = useState(false);
  const [showHariLiburModal, setShowHariLiburModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedHari, setSelectedHari] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [tahunFilter, setTahunFilter] = useState(new Date().getFullYear());
  const [bulanFilter, setBulanFilter] = useState(new Date().getMonth() + 1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('kalender');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const router = useRouter();

  // Form data
  const [hariKerjaForm, setHariKerjaForm] = useState({
    tanggal: '',
    is_hari_kerja: true,
    keterangan: ''
  });

  const [hariLiburForm, setHariLiburForm] = useState({
    tanggal: '',
    nama_libur: '',
    is_tahunan: false,
    tahun: new Date().getFullYear()
  });

  const [bulkForm, setBulkForm] = useState({
    start_date: '',
    end_date: '',
    is_hari_kerja: true,
    keterangan: ''
  });

  // Load data berdasarkan tab
  useEffect(() => {
    if (activeTab === 'kalender') {
      loadKalender();
    } else if (activeTab === 'hari-kerja') {
      loadHariKerja();
    } else if (activeTab === 'hari-libur') {
      loadHariLibur();
    }
  }, [activeTab, tahunFilter, bulanFilter]);

  const loadKalender = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await hariAPI.getKalender({
        tahun: tahunFilter,
        bulan: bulanFilter
      });
      setKalender(response.data.data || []);
      
    } catch (error) {
      console.error('Error loading kalender:', error);
      setError('Gagal memuat data kalender');
      setKalender([]);
    } finally {
      setLoading(false);
    }
  }, [tahunFilter, bulanFilter]);

  const loadHariKerja = useCallback(async () => {
    try {
      setLoading(true);
      const response = await hariAPI.getAllHariKerja({
        tahun: tahunFilter,
        bulan: bulanFilter
      });
      setHariKerjaList(response.data.data || []);
    } catch (error) {
      console.error('Error loading hari kerja:', error);
      setError('Gagal memuat data hari kerja');
      setHariKerjaList([]);
    } finally {
      setLoading(false);
    }
  }, [tahunFilter, bulanFilter]);

  const loadHariLibur = useCallback(async () => {
    try {
      setLoading(true);
      const response = await hariAPI.getAllHariLibur({
        tahun: tahunFilter
      });
      setHariLiburList(response.data.data || []);
    } catch (error) {
      console.error('Error loading hari libur:', error);
      setError('Gagal memuat data hari libur');
      setHariLiburList([]);
    } finally {
      setLoading(false);
    }
  }, [tahunFilter]);

  const refreshData = useCallback(() => {
    if (activeTab === 'kalender') loadKalender();
    else if (activeTab === 'hari-kerja') loadHariKerja();
    else if (activeTab === 'hari-libur') loadHariLibur();
  }, [activeTab, loadKalender, loadHariKerja, loadHariLibur]);

  const handleSubmitHariKerja = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (!hariKerjaForm.tanggal) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "Tanggal wajib diisi",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      if (isEdit) {
        await hariAPI.updateHariKerja(selectedHari.id, hariKerjaForm);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data hari kerja berhasil diupdate",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      } else {
        await hariAPI.createHariKerja(hariKerjaForm);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data hari kerja berhasil ditambahkan",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      }

      setShowHariKerjaModal(false);
      resetHariKerjaForm();
      loadHariKerja();
      loadKalender();

    } catch (error) {
      console.error('Error saving hari kerja:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal menyimpan data hari kerja',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  }, [hariKerjaForm, isEdit, selectedHari, loadHariKerja, loadKalender]);

  const handleSubmitHariLibur = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (!hariLiburForm.tanggal || !hariLiburForm.nama_libur) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "Tanggal dan nama libur wajib diisi",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      if (isEdit) {
        await hariAPI.updateHariLibur(selectedHari.id, hariLiburForm);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data hari libur berhasil diupdate",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      } else {
        await hariAPI.createHariLibur(hariLiburForm);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data hari libur berhasil ditambahkan",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      }

      setShowHariLiburModal(false);
      resetHariLiburForm();
      loadHariLibur();
      loadKalender();

    } catch (error) {
      console.error('Error saving hari libur:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal menyimpan data hari libur',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  }, [hariLiburForm, isEdit, selectedHari, loadHariLibur, loadKalender]);

  const handleBulkSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (!bulkForm.start_date || !bulkForm.end_date) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "Start date dan end date wajib diisi",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      const start = new Date(bulkForm.start_date);
      const end = new Date(bulkForm.end_date);
      
      if (start > end) {
        Swal.fire({
          icon: "warning",
          title: "Tanggal Tidak Valid",
          text: "Start date tidak boleh setelah end date",
          confirmButtonText: "Oke",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }

      const result = await hariAPI.bulkCreateHariKerja(bulkForm);
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: result.data.message,
        confirmButtonText: "Oke",
        confirmButtonColor: "#10B981",
      });

      setShowBulkModal(false);
      resetBulkForm();
      loadHariKerja();
      loadKalender();

    } catch (error) {
      console.error('Error bulk update:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal melakukan bulk update',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  }, [bulkForm, loadHariKerja, loadKalender]);

  const handleEditHariKerja = useCallback((hari) => {
    setSelectedHari(hari);
    setHariKerjaForm({
      tanggal: hari.tanggal,
      is_hari_kerja: hari.is_hari_kerja === 1,
      keterangan: hari.keterangan || ''
    });
    setIsEdit(true);
    setShowHariKerjaModal(true);
  }, []);

  const handleEditHariLibur = useCallback((hari) => {
    setSelectedHari(hari);
    setHariLiburForm({
      tanggal: hari.tanggal,
      nama_libur: hari.nama_libur,
      is_tahunan: hari.is_tahunan === 1,
      tahun: hari.tahun || new Date().getFullYear()
    });
    setIsEdit(true);
    setShowHariLiburModal(true);
  }, []);

  const handleDeleteHariKerja = useCallback(async (id, tanggal) => {
    Swal.fire({
      title: 'Hapus Data Hari Kerja?',
      text: `Yakin ingin menghapus data hari kerja untuk tanggal ${new Date(tanggal).toLocaleDateString('id-ID')}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await hariAPI.deleteHariKerja(id);
          
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data hari kerja berhasil dihapus',
            confirmButtonText: 'Oke',
            confirmButtonColor: '#10B981',
          });
          
          loadHariKerja();
          loadKalender();
        } catch (error) {
          console.error('Error deleting hari kerja:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || 'Gagal menghapus hari kerja',
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#EF4444',
          });
        }
      }
    });
  }, [loadHariKerja, loadKalender]);

  const handleDeleteHariLibur = useCallback(async (id, nama_libur, tanggal) => {
    Swal.fire({
      title: 'Hapus Hari Libur?',
      text: `Yakin ingin menghapus hari libur "${nama_libur}" pada ${new Date(tanggal).toLocaleDateString('id-ID')}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await hariAPI.deleteHariLibur(id);
          
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Hari libur berhasil dihapus',
            confirmButtonText: 'Oke',
            confirmButtonColor: '#10B981',
          });
          
          loadHariLibur();
          loadKalender();
        } catch (error) {
          console.error('Error deleting hari libur:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || 'Gagal menghapus hari libur',
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#EF4444',
          });
        }
      }
    });
  }, [loadHariLibur, loadKalender]);

  const resetHariKerjaForm = useCallback(() => {
    setHariKerjaForm({
      tanggal: '',
      is_hari_kerja: true,
      keterangan: ''
    });
    setIsEdit(false);
    setSelectedHari(null);
  }, []);

  const resetHariLiburForm = useCallback(() => {
    setHariLiburForm({
      tanggal: '',
      nama_libur: '',
      is_tahunan: false,
      tahun: new Date().getFullYear()
    });
    setIsEdit(false);
    setSelectedHari(null);
  }, []);

  const resetBulkForm = useCallback(() => {
    setBulkForm({
      start_date: '',
      end_date: '',
      is_hari_kerja: true,
      keterangan: ''
    });
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const getHariStatus = useCallback((hari) => {
    if (hari.is_libur) {
      return { 
        color: 'bg-gradient-to-br from-red-100 to-pink-100 border-red-200', 
        textColor: 'text-red-800',
        text: 'Libur', 
        icon: '🎉'
      };
    }
    if (!hari.is_hari_kerja) {
      return { 
        color: 'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-200', 
        textColor: 'text-amber-800',
        text: 'Bukan Hari Kerja', 
        icon: '📅'
      };
    }
    if (hari.is_weekend) {
      return { 
        color: 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200', 
        textColor: 'text-blue-800',
        text: 'Weekend', 
        icon: '😎'
      };
    }
    return { 
      color: 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-200', 
      textColor: 'text-green-800',
      text: 'Hari Kerja', 
      icon: '💼'
    };
  }, []);

  // Filter data
  const filteredHariKerja = useMemo(() => 
    hariKerjaList.filter((hari) =>
      hari.tanggal.includes(search) ||
      hari.keterangan?.toLowerCase().includes(search.toLowerCase())
    ), [hariKerjaList, search]
  );

  const filteredHariLibur = useMemo(() => 
    hariLiburList.filter((hari) =>
      hari.tanggal.includes(search) ||
      hari.nama_libur?.toLowerCase().includes(search.toLowerCase())
    ), [hariLiburList, search]
  );

  // Generate tahun options
  const tahunOptions = useMemo(() => {
    const options = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      options.push(i);
    }
    return options;
  }, []);

  // Pagination
  const getCurrentData = useCallback(() => {
    if (activeTab === 'hari-kerja') {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredHariKerja.slice(startIndex, startIndex + itemsPerPage);
    } else if (activeTab === 'hari-libur') {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredHariLibur.slice(startIndex, startIndex + itemsPerPage);
    }
    return [];
  }, [activeTab, currentPage, itemsPerPage, filteredHariKerja, filteredHariLibur]);

  const totalPages = useMemo(() => {
    if (activeTab === 'hari-kerja') {
      return Math.ceil(filteredHariKerja.length / itemsPerPage);
    } else if (activeTab === 'hari-libur') {
      return Math.ceil(filteredHariLibur.length / itemsPerPage);
    }
    return 1;
  }, [activeTab, filteredHariKerja.length, filteredHariLibur.length, itemsPerPage]);

  return {
    // States
    activeTab,
    setActiveTab,
    tahunFilter,
    setTahunFilter,
    bulanFilter,
    setBulanFilter,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    sidebarOpen,
    setSidebarOpen,
    loading,
    error,
    kalender,
    hariKerjaList,
    hariLiburList,
    filteredHariKerja,
    filteredHariLibur,
    totalPages,
    getCurrentData,
    
    // Modal states
    showHariKerjaModal,
    setShowHariKerjaModal,
    showHariLiburModal,
    setShowHariLiburModal,
    showBulkModal,
    setShowBulkModal,
    isEdit,
    selectedHari,
    
    // Form states
    hariKerjaForm,
    setHariKerjaForm,
    hariLiburForm,
    setHariLiburForm,
    bulkForm,
    setBulkForm,
    
    // Handlers
    handleEditHariKerja,
    handleEditHariLibur,
    handleDeleteHariKerja,
    handleDeleteHariLibur,
    handleSubmitHariKerja,
    handleSubmitHariLibur,
    handleBulkSubmit,
    resetHariKerjaForm,
    resetHariLiburForm,
    resetBulkForm,
    refreshData,
    getHariStatus,
    formatDate,
    
    // Options
    tahunOptions,
  };
}