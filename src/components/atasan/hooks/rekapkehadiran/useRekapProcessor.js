"use client";

import { useState, useCallback, useEffect } from "react";

export function useRekapProcessor(presensiData, bulanFilter, tahunFilter, wilayahFilter, search) {
  const [rekapBulanan, setRekapBulanan] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [statistikBulanan, setStatistikBulanan] = useState({
    totalPegawai: 0,
    totalHadir: 0,
    totalTerlambat: 0,
    totalIzin: 0,
    totalTanpaKeterangan: 0,
    persenHadir: 0,
    persenTerlambat: 0,
    persenIzin: 0,
    persenTanpaKeterangan: 0
  });

  const getDaysInMonth = useCallback((year, month) => {
    return new Date(year, month, 0).getDate();
  }, []);

  const processRekap = useCallback(() => {
    // Validasi input
    if (!presensiData || !Array.isArray(presensiData) || presensiData.length === 0) {
      setRekapBulanan([]);
      setStatistikBulanan({
        totalPegawai: 0,
        totalHadir: 0,
        totalTerlambat: 0,
        totalIzin: 0,
        totalTanpaKeterangan: 0,
        persenHadir: 0,
        persenTerlambat: 0,
        persenIzin: 0,
        persenTanpaKeterangan: 0
      });
      return;
    }

    if (!bulanFilter || !tahunFilter) {
      setRekapBulanan([]);
      return;
    }

    setProcessing(true);
    
    try {
      const selectedMonth = parseInt(bulanFilter);
      const selectedYear = parseInt(tahunFilter);
      const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
      
      // Filter data berdasarkan bulan dan tahun
      const filteredData = presensiData.filter(presensi => {
        if (!presensi.tanggal) return false;
        
        const presensiDate = new Date(presensi.tanggal);
        const presensiMonth = presensiDate.getMonth() + 1;
        const presensiYear = presensiDate.getFullYear();
        
        return presensiMonth === selectedMonth && presensiYear === selectedYear;
      });
      
      // Filter berdasarkan wilayah
      let wilayahFilteredData = filteredData;
      if (wilayahFilter && wilayahFilter !== '') {
        wilayahFilteredData = filteredData.filter(presensi => 
          presensi.wilayah_penugasan === wilayahFilter
        );
      }
      
      // Kelompokkan data per pegawai
      const pegawaiMap = new Map();
      
      wilayahFilteredData.forEach(presensi => {
        const pegawaiId = presensi.user_id || presensi.id || presensi.nama;
        const tanggal = new Date(presensi.tanggal).getDate();
        
        if (!pegawaiMap.has(pegawaiId)) {
          pegawaiMap.set(pegawaiId, {
            id: pegawaiId,
            nama: presensi.nama || 'Tidak diketahui',
            jabatan: presensi.jabatan || 'Staf',
            wilayah: presensi.wilayah_penugasan || 'Tidak diketahui',
            presensiHarian: Array(daysInMonth).fill(''),
            totalHadir: 0,
            totalTerlambat: 0,
            totalIzin: 0,
            totalTanpaKeterangan: 0
          });
        }
        
        const pegawaiData = pegawaiMap.get(pegawaiId);
        const dayIndex = tanggal - 1;
        
        // Tentukan status kehadiran
        let status = '';
        if (presensi.izin_id) {
          status = 'I';
          pegawaiData.totalIzin++;
        } else if (!presensi.jam_masuk || presensi.status_masuk === 'Tanpa Keterangan') {
          status = 'TK';
          pegawaiData.totalTanpaKeterangan++;
        } else if (presensi.status_masuk === 'Terlambat' || presensi.status_masuk === 'Terlambat Berat') {
          status = 'T';
          pegawaiData.totalTerlambat++;
          pegawaiData.totalHadir++;
        } else if (presensi.status_masuk === 'Tepat Waktu') {
          status = 'H';
          pegawaiData.totalHadir++;
        } else {
          status = 'H';
          pegawaiData.totalHadir++;
        }
        
        // Hanya set jika dayIndex valid
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          pegawaiData.presensiHarian[dayIndex] = status;
        }
      });
      
      // Konversi Map ke Array dan urutkan
      let rekapArray = Array.from(pegawaiMap.values())
        .sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
      
      // Filter berdasarkan pencarian
      if (search && search.trim() !== '') {
        const searchLower = search.toLowerCase().trim();
        rekapArray = rekapArray.filter(pegawai => 
          (pegawai.nama || '').toLowerCase().includes(searchLower) ||
          (pegawai.jabatan || '').toLowerCase().includes(searchLower)
        );
      }
      
      // Hitung statistik
      const totals = rekapArray.reduce((acc, pegawai) => ({
        totalHadir: acc.totalHadir + (pegawai.totalHadir || 0),
        totalTerlambat: acc.totalTerlambat + (pegawai.totalTerlambat || 0),
        totalIzin: acc.totalIzin + (pegawai.totalIzin || 0),
        totalTanpaKeterangan: acc.totalTanpaKeterangan + (pegawai.totalTanpaKeterangan || 0)
      }), { totalHadir: 0, totalTerlambat: 0, totalIzin: 0, totalTanpaKeterangan: 0 });
      
      const totalPegawai = rekapArray.length;
      const totalKehadiran = totals.totalHadir + totals.totalTerlambat;
      const totalPresensi = totalKehadiran + totals.totalIzin + totals.totalTanpaKeterangan;
      
      setStatistikBulanan({
        totalPegawai,
        totalHadir: totals.totalHadir,
        totalTerlambat: totals.totalTerlambat,
        totalIzin: totals.totalIzin,
        totalTanpaKeterangan: totals.totalTanpaKeterangan,
        persenHadir: totalPresensi > 0 ? Math.round((totalKehadiran / totalPresensi) * 100) : 0,
        persenTerlambat: totalPresensi > 0 ? Math.round((totals.totalTerlambat / totalPresensi) * 100) : 0,
        persenIzin: totalPresensi > 0 ? Math.round((totals.totalIzin / totalPresensi) * 100) : 0,
        persenTanpaKeterangan: totalPresensi > 0 ? Math.round((totals.totalTanpaKeterangan / totalPresensi) * 100) : 0
      });
      
      setRekapBulanan(rekapArray);
      
    } catch (error) {
      console.error('Error processing rekap data:', error);
      setRekapBulanan([]);
      setStatistikBulanan({
        totalPegawai: 0,
        totalHadir: 0,
        totalTerlambat: 0,
        totalIzin: 0,
        totalTanpaKeterangan: 0,
        persenHadir: 0,
        persenTerlambat: 0,
        persenIzin: 0,
        persenTanpaKeterangan: 0
      });
    } finally {
      setProcessing(false);
    }
  }, [bulanFilter, tahunFilter, wilayahFilter, search, presensiData, getDaysInMonth]);

  // Auto-process when dependencies change
  useEffect(() => {
    if (presensiData && presensiData.length > 0 && bulanFilter && tahunFilter) {
      processRekap();
    }
  }, [bulanFilter, tahunFilter, wilayahFilter, search, presensiData, processRekap]);

  return {
    rekapBulanan: rekapBulanan || [],
    statistikBulanan: statistikBulanan || {
      totalPegawai: 0,
      totalHadir: 0,
      totalTerlambat: 0,
      totalIzin: 0,
      totalTanpaKeterangan: 0,
      persenHadir: 0,
      persenTerlambat: 0,
      persenIzin: 0,
      persenTanpaKeterangan: 0
    },
    processing,
    processRekap,
    getDaysInMonth
  };
}