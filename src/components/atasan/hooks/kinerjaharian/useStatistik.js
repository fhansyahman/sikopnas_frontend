"use client";

import { useState, useEffect, useMemo } from "react";

export function useStatistik(kinerjaList) {
  const [statistik, setStatistik] = useState({
    total_laporan: 0,
    total_pegawai: 0,
    avg_panjang_kr: 0,
    avg_panjang_kn: 0,
    total_panjang_kr: 0,
    total_panjang_kn: 0,
    wilayah: {},
    chart_data: {
      labels: [],
      datasets: [{ data: [] }]
    }
  });

  useEffect(() => {
    if (!kinerjaList || kinerjaList.length === 0) {
      setStatistik(getEmptyStatistik());
      return;
    }

    const calculated = calculateStatistics(kinerjaList);
    setStatistik(calculated);
  }, [kinerjaList]);

  return statistik;
}

function calculateStatistics(data) {
  console.log('Calculating statistics for data:', data);
  
  const totalLaporan = data.length;
  const uniquePegawai = [...new Set(data.map(item => item.user_id || item.nama))].length;
  
  // Pastikan nilai panjang adalah number
  const totalPanjangKR = data.reduce((sum, item) => {
    const kr = parseFloat(item.panjang_kr) || 0;
    return sum + kr;
  }, 0);
  
  const totalPanjangKN = data.reduce((sum, item) => {
    const kn = parseFloat(item.panjang_kn) || 0;
    return sum + kn;
  }, 0);
  
  const avgPanjangKR = totalLaporan > 0 ? totalPanjangKR / totalLaporan : 0;
  const avgPanjangKN = totalLaporan > 0 ? totalPanjangKN / totalLaporan : 0;
  
  // Statistik per wilayah
  const wilayahStatistik = {};
  data.forEach(item => {
    const wilayah = item.wilayah_penugasan || 'Unknown';
    
    if (!wilayahStatistik[wilayah]) {
      wilayahStatistik[wilayah] = {
        total: 0,
        total_kr: 0,
        total_kn: 0,
        avg_kr: 0,
        avg_kn: 0,
        total_pegawai: new Set()
      };
    }
    
    wilayahStatistik[wilayah].total++;
    wilayahStatistik[wilayah].total_kr += parseFloat(item.panjang_kr) || 0;
    wilayahStatistik[wilayah].total_kn += parseFloat(item.panjang_kn) || 0;
    wilayahStatistik[wilayah].total_pegawai.add(item.user_id || item.nama);
  });
  
  // Hitung rata-rata per wilayah
  Object.keys(wilayahStatistik).forEach(wilayah => {
    const w = wilayahStatistik[wilayah];
    w.avg_kr = w.total > 0 ? w.total_kr / w.total : 0;
    w.avg_kn = w.total > 0 ? w.total_kn / w.total : 0;
    w.total_pegawai = w.total_pegawai.size;
  });
  
  console.log('Calculated wilayah statistik:', wilayahStatistik);
  
  return {
    total_laporan: totalLaporan,
    total_pegawai: uniquePegawai,
    avg_panjang_kr: parseFloat(avgPanjangKR.toFixed(2)),
    avg_panjang_kn: parseFloat(avgPanjangKN.toFixed(2)),
    total_panjang_kr: parseFloat(totalPanjangKR.toFixed(2)),
    total_panjang_kn: parseFloat(totalPanjangKN.toFixed(2)),
    wilayah: wilayahStatistik,
    chart_data: {
      labels: Object.keys(wilayahStatistik),
      datasets: [{
        data: Object.values(wilayahStatistik).map(w => w.total),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderColor: ['#1D4ED8', '#0DA675', '#D97706', '#DC2626', '#6D28D9'],
        borderWidth: 1
      }]
    }
  };
}

function getEmptyStatistik() {
  return {
    total_laporan: 0,
    total_pegawai: 0,
    avg_panjang_kr: 0,
    avg_panjang_kn: 0,
    total_panjang_kr: 0,
    total_panjang_kn: 0,
    wilayah: {},
    chart_data: {
      labels: [],
      datasets: [{ data: [] }]
    }
  };
}