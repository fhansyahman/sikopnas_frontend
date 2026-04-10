"use client";

import { useState, useCallback } from "react";

export function useStatistik() {
  const [statistik, setStatistik] = useState({});

  const getEmptyStatistik = useCallback(() => ({
    total_pegawai: 0,
    hadir_hari_ini: 0,
    total_hadir: 0,
    total_terlambat: 0,
    total_tepat_waktu: 0,
    total_tanpa_keterangan: 0,
    total_izin: 0,
    total_lembur: 0,
    persen_tepat_waktu: 0,
    persen_terlambat: 0,
    persen_tanpa_keterangan: 0,
    persen_izin: 0,
    persen_hadir: 0,
    wilayah: {},
    chart_data: {
      labels: ['Hadir', 'Terlambat', 'Izin', 'Tanpa Keterangan'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
        borderColor: ['#0DA675', '#D97706', '#7C3AED', '#DC2626'],
        borderWidth: 1
      }]
    }
  }), []);

  const calculateStatistik = useCallback((data) => {
    if (!data || data.length === 0) {
      setStatistik(getEmptyStatistik());
      return;
    }

    const totalPegawai = data.length;
    const hadir = data.filter(p => 
      p.jam_masuk !== null && 
      p.status_masuk !== 'Tanpa Keterangan' &&
      p.izin_id === null
    ).length;
    
    const terlambat = data.filter(p => 
      p.status_masuk === 'Terlambat' &&
      p.izin_id === null
    ).length;
    
    const tepatWaktu = data.filter(p => 
      p.status_masuk === 'Tepat Waktu' &&
      p.izin_id === null
    ).length;
    
    const tanpaKeterangan = data.filter(p => 
      (p.status_masuk === 'Tanpa Keterangan' && p.izin_id === null) ||
      (p.jam_masuk === null && p.izin_id === null)
    ).length;
    
    const izin = data.filter(p => p.izin_id !== null).length;
    const lembur = data.filter(p => p.is_lembur === 1 || p.is_lembur === true).length;
    
    const persenHadir = totalPegawai > 0 ? Math.round((hadir / totalPegawai) * 100) : 0;
    const persenTerlambat = totalPegawai > 0 ? Math.round((terlambat / totalPegawai) * 100) : 0;
    const persenTepatWaktu = totalPegawai > 0 ? Math.round((tepatWaktu / totalPegawai) * 100) : 0;
    const persenTanpaKeterangan = totalPegawai > 0 ? Math.round((tanpaKeterangan / totalPegawai) * 100) : 0;
    const persenIzin = totalPegawai > 0 ? Math.round((izin / totalPegawai) * 100) : 0;
    
    const wilayahStatistik = {};
    data.forEach(presensi => {
      const wilayah = presensi.wilayah_penugasan || 'Unknown';
      
      if (!wilayahStatistik[wilayah]) {
        wilayahStatistik[wilayah] = {
          hadir: 0,
          total: 0,
          terlambat: 0,
          tepat_waktu: 0,
          tanpa_keterangan: 0,
          izin: 0,
          lembur: 0
        };
      }
      
      wilayahStatistik[wilayah].total++;
      
      if (presensi.izin_id !== null) {
        wilayahStatistik[wilayah].izin++;
      } else if (presensi.jam_masuk !== null && presensi.status_masuk !== 'Tanpa Keterangan') {
        wilayahStatistik[wilayah].hadir++;
        
        if (presensi.status_masuk === 'Terlambat') {
          wilayahStatistik[wilayah].terlambat++;
        }
        
        if (presensi.status_masuk === 'Tepat Waktu') {
          wilayahStatistik[wilayah].tepat_waktu++;
        }
      } else {
        wilayahStatistik[wilayah].tanpa_keterangan++;
      }
      
      if (presensi.is_lembur === 1 || presensi.is_lembur === true) {
        wilayahStatistik[wilayah].lembur++;
      }
    });
    
    setStatistik({
      total_pegawai: totalPegawai,
      hadir_hari_ini: hadir,
      total_hadir: hadir,
      total_terlambat: terlambat,
      total_tepat_waktu: tepatWaktu,
      total_tanpa_keterangan: tanpaKeterangan,
      total_izin: izin,
      total_lembur: lembur,
      persen_hadir: persenHadir,
      persen_tepat_waktu: persenTepatWaktu,
      persen_terlambat: persenTerlambat,
      persen_tanpa_keterangan: persenTanpaKeterangan,
      persen_izin: persenIzin,
      wilayah: wilayahStatistik,
      chart_data: {
        labels: ['Hadir', 'Terlambat', 'Izin', 'Tanpa Keterangan'],
        datasets: [{
          data: [hadir, terlambat, izin, tanpaKeterangan],
          backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
          borderColor: ['#0DA675', '#D97706', '#7C3AED', '#DC2626'],
          borderWidth: 1
        }]
      }
    });
  }, [getEmptyStatistik]);

  return { statistik, calculateStatistik, getEmptyStatistik };
}