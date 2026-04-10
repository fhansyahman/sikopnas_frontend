"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export function useFilters(onFilterChange) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [tanggalFilter, setTanggalFilter] = useState("");

  // Set default tanggal ke hari ini
  useEffect(() => {
    if (!tanggalFilter) {
      const today = new Date().toISOString().split('T')[0];
      setTanggalFilter(today);
    }
  }, [tanggalFilter]);

  // Load data saat filter berubah
  useEffect(() => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (jenisFilter) filters.jenis = jenisFilter;
    if (tanggalFilter) filters.tanggal = tanggalFilter;
    
    onFilterChange(filters);
  }, [statusFilter, jenisFilter, tanggalFilter, onFilterChange]);

  const handleResetFilters = useCallback(() => {
    setStatusFilter('');
    setJenisFilter('');
    const today = new Date().toISOString().split('T')[0];
    setTanggalFilter(today);
    setSearch('');
  }, []);

  const handleRefresh = useCallback(() => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (jenisFilter) filters.jenis = jenisFilter;
    if (tanggalFilter) filters.tanggal = tanggalFilter;
    onFilterChange(filters);
  }, [statusFilter, jenisFilter, tanggalFilter, onFilterChange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter) count++;
    if (jenisFilter) count++;
    if (tanggalFilter && tanggalFilter !== new Date().toISOString().split('T')[0]) count++;
    if (search) count++;
    return count;
  }, [statusFilter, jenisFilter, tanggalFilter, search]);

  return {
    search,
    statusFilter,
    jenisFilter,
    tanggalFilter,
    setSearch,
    setStatusFilter,
    setJenisFilter,
    setTanggalFilter,
    handleResetFilters,
    handleRefresh,
    activeFilterCount
  };
}