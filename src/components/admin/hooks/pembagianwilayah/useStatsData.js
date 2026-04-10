"use client";

import { useState, useCallback } from 'react'; // TIDAK PERLU useEffect KARENA TIDAK ADA AUTO-LOAD
import { wilayahAPI } from '@/lib/api';

export function useStatsData() {
  const [wilayahStats, setWilayahStats] = useState({});
  const [loading, setLoading] = useState(false);

  const loadWilayahStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await wilayahAPI.getStats();
      setWilayahStats(response.data.data || {});
    } catch (error) {
      console.error('Error loading stats:', error);
      setWilayahStats({});
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    wilayahStats,
    loading,
    loadWilayahStats
  };
}