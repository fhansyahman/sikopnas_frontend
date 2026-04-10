"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

export function useFilters() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    wilayah: "",
    tanggal: ""
  });

  // Set default tanggal ke hari ini
  useEffect(() => {
    if (!filters.tanggal) {
      const today = new Date().toISOString().split('T')[0];
      setFilters(prev => ({ ...prev, tanggal: today }));
    }
  }, []);

  const resetFilters = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    console.log('🔄 Reset semua filter');
    setFilters({
      search: "",
      status: "",
      wilayah: "",
      tanggal: today
    });
  }, []);

  // Hitung active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search && filters.search.trim() !== '') count++;
    if (filters.status && filters.status !== '') count++;
    if (filters.wilayah && filters.wilayah !== '') count++;
    
    const today = new Date().toISOString().split('T')[0];
    if (filters.tanggal && filters.tanggal !== today) count++;
    
    console.log('📊 Active filter count:', count, filters);
    return count;
  }, [filters]);

  // Update filter
  const updateFilter = useCallback((key, value) => {
    console.log(`🎯 Update filter ${key}:`, value);
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      console.log('📦 Filters baru:', newFilters);
      return newFilters;
    });
  }, []);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    activeFilterCount
  };
}