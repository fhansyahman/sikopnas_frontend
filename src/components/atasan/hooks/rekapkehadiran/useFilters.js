"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

export function useFilters() {
  const [search, setSearch] = useState("");
  const [bulanFilter, setBulanFilter] = useState("");
  const [tahunFilter, setTahunFilter] = useState("");
  const [wilayahFilter, setWilayahFilter] = useState("");

  // Inisialisasi filter default
  useEffect(() => {
    const today = new Date();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = today.getFullYear().toString();
    
    setBulanFilter(currentMonth);
    setTahunFilter(currentYear);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (bulanFilter) count++;
    if (tahunFilter) count++;
    if (wilayahFilter) count++;
    if (search) count++;
    return count;
  }, [bulanFilter, tahunFilter, wilayahFilter, search]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setWilayahFilter("");
    const today = new Date();
    setBulanFilter((today.getMonth() + 1).toString().padStart(2, '0'));
    setTahunFilter(today.getFullYear().toString());
  }, []);

  const setToCurrentMonth = useCallback(() => {
    const today = new Date();
    setBulanFilter((today.getMonth() + 1).toString().padStart(2, '0'));
    setTahunFilter(today.getFullYear().toString());
  }, []);

  const getBulanOptions = useCallback(() => {
    return [
      { value: '01', label: 'Januari' },
      { value: '02', label: 'Februari' },
      { value: '03', label: 'Maret' },
      { value: '04', label: 'April' },
      { value: '05', label: 'Mei' },
      { value: '06', label: 'Juni' },
      { value: '07', label: 'Juli' },
      { value: '08', label: 'Agustus' },
      { value: '09', label: 'September' },
      { value: '10', label: 'Oktober' },
      { value: '11', label: 'November' },
      { value: '12', label: 'Desember' }
    ];
  }, []);

  const getTahunOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i.toString());
    }
    return years;
  }, []);

  const getBulanLabel = useCallback((monthValue) => {
    const bulan = getBulanOptions().find(b => b.value === monthValue);
    return bulan ? bulan.label : monthValue;
  }, [getBulanOptions]);

  return {
    search,
    bulanFilter,
    tahunFilter,
    wilayahFilter,
    setSearch,
    setBulanFilter,
    setTahunFilter,
    setWilayahFilter,
    resetFilters,
    setToCurrentMonth,
    activeFilterCount,
    getBulanOptions,
    getTahunOptions,
    getBulanLabel
  };
}