"use client";

import { useState, useCallback } from "react";
import { adminPresensiAPI } from "@/lib/api";

export function usePresensiData() {
  const [presensiData, setPresensiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminPresensiAPI.getAll({});
      // Pastikan data adalah array
      const data = response.data?.data || [];
      setPresensiData(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error('Error loading presensi data:', error);
      setError(error.response?.data?.message || error.message || 'Gagal memuat data presensi');
      setPresensiData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    presensiData,
    loading,
    error,
    loadData,
    refreshData
  };
}