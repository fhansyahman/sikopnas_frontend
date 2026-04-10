"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { izinAPI } from "@/lib/api";

export function useIzinData() {
  const [izinList, setIzinList] = useState([]);
  const [filteredIzinList, setFilteredIzinList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [periodeInfo, setPeriodeInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [totalData, setTotalData] = useState(0);

  // Load user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserInfo({
            id: user.id,
            name: user.nama || user.name || "Nama Anda",
            email: user.email || "email@anda.com",
            role: user.roles || user.role || "pegawai"
          });
        } else {
          setUserInfo({
            id: null,
            name: "Nama Anda",
            email: "email@anda.com",
            role: "pegawai"
          });
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setUserInfo({
          id: null,
          name: "Nama Anda",
          email: "email@anda.com",
          role: "pegawai"
        });
      }
    };

    loadUserInfo();
  }, []);

  // Load izin data per bulan dari backend
  const loadIzinPerBulan = useCallback(async (bulan, tahun) => {
    try {
      setLoading(true);
      
      // Gunakan bulan dan tahun yang dipilih, atau default ke current
      const targetBulan = bulan || selectedMonth;
      const targetTahun = tahun || selectedYear;
      
      // Jika tidak ada filter, gunakan bulan/tahun saat ini
      let finalBulan = targetBulan;
      let finalTahun = targetTahun;
      
      if (!finalBulan && !finalTahun) {
        finalBulan = (new Date().getMonth() + 1).toString().padStart(2, '0');
        finalTahun = new Date().getFullYear().toString();
      }
      
      console.log(`📊 Fetching izin per bulan: ${finalBulan}/${finalTahun}`);
      const response = await izinAPI.getMyIzinPerBulan(finalBulan, finalTahun);
      
      console.log('Izin API response:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Set data dari API
        setIzinList(data.izin || []);
        setFilteredIzinList(data.izin || []);
        setStats(data.stats);
        setPeriodeInfo(data.periode);
        setTotalData(data.izin?.length || 0);
        
        // Update selected month/year state
        if (data.periode) {
          setSelectedMonth(data.periode.bulan.toString().padStart(2, '0'));
          setSelectedYear(data.periode.tahun.toString());
        }
      } else {
        console.error('API returned error:', response.data.message);
        setIzinList([]);
        setFilteredIzinList([]);
        setTotalData(0);
      }
    } catch (error) {
      console.error('Error loading izin:', error);
      setIzinList([]);
      setFilteredIzinList([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  // Initial load - bulan/tahun saat ini
  useEffect(() => {
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear().toString();
    loadIzinPerBulan(currentMonth, currentYear);
  }, []);

  // Handle month change
  const handleMonthChange = useCallback((month) => {
    setSelectedMonth(month);
    if (month && selectedYear) {
      loadIzinPerBulan(month, selectedYear);
    } else if (month && !selectedYear) {
      loadIzinPerBulan(month, new Date().getFullYear().toString());
    }
  }, [selectedYear, loadIzinPerBulan]);

  // Handle year change
  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    if (year && selectedMonth) {
      loadIzinPerBulan(selectedMonth, year);
    } else if (year && !selectedMonth) {
      loadIzinPerBulan((new Date().getMonth() + 1).toString().padStart(2, '0'), year);
    }
  }, [selectedMonth, loadIzinPerBulan]);

  // Apply filter
  const applyFilter = useCallback(() => {
    if (selectedMonth || selectedYear) {
      const bulan = selectedMonth || (new Date().getMonth() + 1).toString().padStart(2, '0');
      const tahun = selectedYear || new Date().getFullYear().toString();
      loadIzinPerBulan(bulan, tahun);
    }
    setShowFilter(false);
  }, [selectedMonth, selectedYear, loadIzinPerBulan]);

  // Reset filter
  const resetFilter = useCallback(() => {
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear().toString();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    loadIzinPerBulan(currentMonth, currentYear);
    setShowFilter(false);
  }, [loadIzinPerBulan]);

  // Set to current month
  const setToCurrentMonth = useCallback(() => {
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentYear = new Date().getFullYear().toString();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    loadIzinPerBulan(currentMonth, currentYear);
  }, [loadIzinPerBulan]);

  // Go to previous month
  const goToPreviousMonth = useCallback(() => {
    let newMonth = parseInt(selectedMonth) - 1;
    let newYear = parseInt(selectedYear);
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    const newMonthStr = newMonth.toString().padStart(2, '0');
    const newYearStr = newYear.toString();
    
    setSelectedMonth(newMonthStr);
    setSelectedYear(newYearStr);
    loadIzinPerBulan(newMonthStr, newYearStr);
  }, [selectedMonth, selectedYear, loadIzinPerBulan]);

  // Go to next month
  const goToNextMonth = useCallback(() => {
    let newMonth = parseInt(selectedMonth) + 1;
    let newYear = parseInt(selectedYear);
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    
    const newMonthStr = newMonth.toString().padStart(2, '0');
    const newYearStr = newYear.toString();
    
    setSelectedMonth(newMonthStr);
    setSelectedYear(newYearStr);
    loadIzinPerBulan(newMonthStr, newYearStr);
  }, [selectedMonth, selectedYear, loadIzinPerBulan]);

  // Toggle filter
  const toggleFilter = useCallback(() => {
    setShowFilter(prev => !prev);
  }, []);

  // Get available months from API response (or generate from data)
  const getAvailableMonths = useCallback(() => {
    // Return static months since backend handles filtering
    return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  }, []);

  // Get available years from API response
  const getAvailableYears = useCallback(() => {
    // Return available years from stats or generate recent years
    const currentYear = new Date().getFullYear();
    return [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];
  }, []);

  const getMonthName = useCallback((monthNumber) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[parseInt(monthNumber) - 1] || '';
  }, []);

  const isFilterActive = useMemo(() => 
    !!(selectedMonth && selectedYear), 
    [selectedMonth, selectedYear]
  );

  return {
    loading,
    userInfo,
    izinList: filteredIzinList,
    filteredIzinList,
    totalData,
    selectedMonth,
    selectedYear,
    showFilter,
    isFilterActive,
    stats,
    periodeInfo,
    setSelectedMonth: handleMonthChange,
    setSelectedYear: handleYearChange,
    setShowFilter: toggleFilter,
    resetFilter,
    setToCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    applyFilter,
    toggleFilter,
    loadIzin: () => loadIzinPerBulan(selectedMonth, selectedYear),
    getAvailableMonths,
    getAvailableYears,
    getMonthName
  };
}