"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export function useFilters() {
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    wilayah: "",
    tanggal: ""
  });
  const [initialized, setInitialized] = useState(false);

  // Set default tanggal dan wilayah setelah user tersedia
  useEffect(() => {
    if (!authLoading && user && !initialized) {
      const today = new Date().toISOString().split('T')[0];
      
      console.log('🎯 Initializing filters with user:', user);
      
      setFilters(prev => {
        const newFilters = { 
          ...prev, 
          tanggal: today 
        };
        
        // Set wilayah dari user jika ada
        if (user?.wilayah_penugasan) {
          newFilters.wilayah = user.wilayah_penugasan;
          console.log('📍 Set default wilayah:', user.wilayah_penugasan);
        }
        
        return newFilters;
      });
      
      setInitialized(true);
    }
  }, [user, authLoading, initialized]);

  const resetFilters = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    console.log('🔄 Reset semua filter');
    
    setFilters(prev => {
      const newFilters = {
        search: "",
        status: "",
        tanggal: today
      };
      
      // Reset ke wilayah user jika ada
      if (user?.wilayah_penugasan) {
        newFilters.wilayah = user.wilayah_penugasan;
      } else {
        newFilters.wilayah = "";
      }
      
      console.log('📦 Filters setelah reset:', newFilters);
      return newFilters;
    });
  }, [user]);

  // Hitung active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search && filters.search.trim() !== '') count++;
    if (filters.status && filters.status !== '') count++;
    
    // Hitung wilayah jika berbeda dari default user
    const defaultWilayah = user?.wilayah_penugasan || '';
    if (filters.wilayah && filters.wilayah !== defaultWilayah) count++;
    
    const today = new Date().toISOString().split('T')[0];
    if (filters.tanggal && filters.tanggal !== today) count++;
    
    return count;
  }, [filters, user]);

  // Update filter
  const updateFilter = useCallback((key, value) => {
    console.log(`🎯 Update filter ${key}:`, value);
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      return newFilters;
    });
  }, []);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    activeFilterCount,
    initialized,
    authLoading,
    user
  };
}