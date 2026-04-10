"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jamKerjaAPI } from "@/lib/api";
import Swal from "sweetalert2";

export function useJamKerja() {
  const [jamKerja, setJamKerja] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingJamKerja, setEditingJamKerja] = useState(null);
  const [selectedJamKerja, setSelectedJamKerja] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const router = useRouter();

  // Load data
  const loadJamKerja = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jamKerjaAPI.getAll();
      
      let jamKerjaData = [];
      
      if (Array.isArray(response.data)) {
        jamKerjaData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        jamKerjaData = response.data.data;
      } else {
        console.warn('Unexpected API response structure:', response);
        jamKerjaData = [];
      }
      
      setJamKerja(jamKerjaData);
    } catch (error) {
      console.error('Error loading jam kerja:', error);
      setError('Gagal memuat data jam kerja');
      setJamKerja([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJamKerja();
  }, [loadJamKerja]);

  // Filter jam kerja
  const filteredJamKerja = useMemo(() => {
    return jamKerja.filter((jk) => {
      const matchesSearch = jk.nama_setting?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "semua" || 
                           (statusFilter === "aktif" && jk.is_active) ||
                           (statusFilter === "nonaktif" && !jk.is_active);
      
      return matchesSearch && matchesStatus;
    });
  }, [jamKerja, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredJamKerja.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJamKerja = useMemo(() => {
    return filteredJamKerja.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJamKerja, startIndex, itemsPerPage]);

  // Stats
  const stats = useMemo(() => ({
    total: jamKerja.length,
    aktif: jamKerja.filter(jk => jk.is_active).length,
    nonaktif: jamKerja.filter(jk => !jk.is_active).length,
    rataJamKerja: "8 jam"
  }), [jamKerja]);

  // Format waktu
  const formatTime = useCallback((timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  }, []);

  // Calculate total hours
  const calculateTotalHours = useCallback((jamMasuk, jamPulang) => {
    if (!jamMasuk || !jamPulang) return '0';
    const [masukHours, masukMinutes] = jamMasuk.split(':').map(Number);
    const [pulangHours, pulangMinutes] = jamPulang.split(':').map(Number);
    
    const totalMinutes = (pulangHours * 60 + pulangMinutes) - (masukHours * 60 + masukMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours} jam ${minutes > 0 ? `${minutes} menit` : ''}`;
  }, []);

  // Modal handlers
  const handleShowAddModal = useCallback(() => {
    setEditingJamKerja(null);
    setShowModal(true);
  }, []);

  const handleShowEditModal = useCallback((jk) => {
    setEditingJamKerja(jk);
    setShowModal(true);
  }, []);

  const handleViewDetail = useCallback((jk) => {
    setSelectedJamKerja(jk);
    setShowDetailModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingJamKerja(null);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedJamKerja(null);
  }, []);

  // Delete handler
  const handleDelete = useCallback(async (jk) => {
    const result = await Swal.fire({
      title: "Yakin hapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Iya, hapus!",
      cancelButtonText: "Tidak",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (result.isConfirmed) {
      try {
        await jamKerjaAPI.delete(jk.id);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data jam kerja berhasil dihapus.",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
        loadJamKerja();
      } catch (error) {
        console.error('Error deleting jam kerja:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || 'Gagal menghapus jam kerja',
          confirmButtonText: "Tutup",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  }, [loadJamKerja]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  // Submit handler (akan diisi dari hook form)
  const handleSubmit = useCallback(async (formData) => {
    try {
      const submitData = {
        ...formData,
        jam_masuk_standar: formData.jam_masuk_standar + ':00',
        jam_pulang_standar: formData.jam_pulang_standar + ':00',
        toleransi_keterlambatan: formData.toleransi_keterlambatan + ':00',
        batas_terlambat: formData.batas_terlambat + ':00',
        is_active: formData.is_active ? 1 : 0
      };

      if (editingJamKerja) {
        await jamKerjaAPI.update(editingJamKerja.id, submitData);
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Data jam kerja berhasil diperbarui!",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      } else {
        await jamKerjaAPI.create(submitData);
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Data jam kerja berhasil disimpan!",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      }
      
      handleCloseModal();
      loadJamKerja();
    } catch (error) {
      console.error('Error saving jam kerja:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal menyimpan jam kerja',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  }, [editingJamKerja, handleCloseModal, loadJamKerja]);

  return {
    // Data & States
    jamKerja,
    loading,
    error,
    search,
    statusFilter,
    currentPage,
    itemsPerPage,
    showModal,
    showDetailModal,
    editingJamKerja,
    selectedJamKerja,
    sidebarOpen,
    
    // Data hasil filter & pagination
    filteredJamKerja,
    paginatedJamKerja,
    totalPages,
    startIndex,
    stats,
    
    // Actions
    setSearch,
    setStatusFilter,
    setCurrentPage,
    setSidebarOpen,
    handleShowAddModal,
    handleShowEditModal,
    handleViewDetail,
    handleDelete,
    handleSubmit,
    handleCloseModal,
    handleCloseDetailModal,
    loadJamKerja,
    handleLogout,
    
    // Utilities
    formatTime,
    calculateTotalHours
  };
}