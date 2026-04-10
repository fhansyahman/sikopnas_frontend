"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

export function useFilters(onFilterChange) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [tanggalFilter, setTanggalFilter] = useState("");
  const [wilayahFilter, setWilayahFilter] = useState("");

  // Set default tanggal ke hari ini
  useEffect(() => {
    if (!tanggalFilter) {
      const today = new Date().toISOString().split('T')[0];
      setTanggalFilter(today);
    }
  }, []); // Hapus dependency tanggalFilter

  // Set filter wilayah berdasarkan user yang login dan trigger initial load
  useEffect(() => {
    if (user?.wilayah_penugasan) {
      console.log('Setting wilayah filter:', user.wilayah_penugasan);
      setWilayahFilter(user.wilayah_penugasan);
    }
  }, [user]);

  // Load data saat filter berubah atau pertama kali user tersedia
  useEffect(() => {
    // Pastikan user sudah ada dan tanggal filter sudah diset
    if (user && tanggalFilter) {
      const filters = {};
      
      // Prioritaskan wilayahFilter, fallback ke user.wilayah_penugasan
      if (wilayahFilter) {
        filters.wilayah = wilayahFilter;
      } else if (user?.wilayah_penugasan) {
        filters.wilayah = user.wilayah_penugasan;
      }
      
      if (statusFilter) filters.status = statusFilter;
      if (jenisFilter) filters.jenis = jenisFilter;
      if (tanggalFilter) filters.tanggal = tanggalFilter;
      
      console.log('Applying filters:', filters);
      onFilterChange(filters);
    }
  }, [statusFilter, jenisFilter, tanggalFilter, wilayahFilter, user, onFilterChange]);

  const handleResetFilters = useCallback(() => {
    setStatusFilter('');
    setJenisFilter('');
    
    // Reset ke wilayah user
    if (user?.wilayah_penugasan) {
      setWilayahFilter(user.wilayah_penugasan);
    } else {
      setWilayahFilter('');
    }
    
    const today = new Date().toISOString().split('T')[0];
    setTanggalFilter(today);
    setSearch('');
  }, [user]);

  const handleRefresh = useCallback(() => {
    const filters = {};
    
    // Prioritaskan wilayahFilter, fallback ke user.wilayah_penugasan
    if (wilayahFilter) {
      filters.wilayah = wilayahFilter;
    } else if (user?.wilayah_penugasan) {
      filters.wilayah = user.wilayah_penugasan;
    }
    
    if (statusFilter) filters.status = statusFilter;
    if (jenisFilter) filters.jenis = jenisFilter;
    if (tanggalFilter) filters.tanggal = tanggalFilter;
    
    console.log('Refreshing with filters:', filters);
    onFilterChange(filters);
  }, [statusFilter, jenisFilter, tanggalFilter, wilayahFilter, user, onFilterChange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter) count++;
    if (jenisFilter) count++;
    if (tanggalFilter && tanggalFilter !== new Date().toISOString().split('T')[0]) count++;
    if (search) count++;
    
    const defaultWilayah = user?.wilayah_penugasan || '';
    if (wilayahFilter && wilayahFilter !== defaultWilayah) count++;
    
    return count;
  }, [statusFilter, jenisFilter, tanggalFilter, search, wilayahFilter, user]);

  return {
    search,
    statusFilter,
    jenisFilter,
    tanggalFilter,
    wilayahFilter,
    setSearch,
    setStatusFilter,
    setJenisFilter,
    setTanggalFilter,
    setWilayahFilter,
    handleResetFilters,
    handleRefresh,
    activeFilterCount,
    user
  };
}