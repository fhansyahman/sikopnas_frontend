"use client";

import { useState, useCallback, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import Swal from "sweetalert2";
import { formatDate } from "../../utils/dashboard/formatters";

export function useMonitoringData() {
  const [state, setState] = useState({
    selectedDate: new Date().toISOString().split('T')[0],
    dataBelumAbsen: [],
    dataBelumLapor: [],
    dataIzin: [],
    dataSakit: [],
    dataCuti: [],
    semuaPegawai: [],
    presensiData: [],
    kinerjaData: [],
    loading: {
      data: false,
      stats: false
    },
    stats: {
      totalPegawai: 0,
      hadir: 0,
      terlambat: 0,
      tepatWaktu: 0,
      izin: 0,
      sakit: 0,
      cuti: 0,
      belumAbsen: 0,
      belumLapor: 0,
      sudahLapor: 0,
      tanpaKeterangan: 0
    },
    lastUpdated: null
  });

  // ==================== DETEKSI STATUS DENGAN PRIORITAS ====================

  const kategorikanPresensi = useCallback((presensiData) => {
    if (!presensiData || !Array.isArray(presensiData)) {
      return {
        izin: [],
        sakit: [],
        cuti: [],
        hadir: []
      };
    }
    
    // Gunakan Map untuk memastikan setiap pegawai hanya masuk SATU kategori
    const izinMap = new Map();
    const sakitMap = new Map();
    const cutiMap = new Map();
    const hadirMap = new Map();
    
    // Prioritas: Izin > Sakit > Cuti > Hadir
    // Jika pegawai punya multiple status, ambil yang prioritas tertinggi
    
    presensiData.forEach(presensi => {
      const pegawaiId = presensi.pegawai_id || presensi.id;
      const nama = presensi.nama;
      
      if (!pegawaiId && !nama) return; // Skip jika tidak ada identitas
      
      const key = pegawaiId || nama;
      
      // Cek apakah ini Izin
      const isIzin = 
        presensi.izin_id !== null && presensi.izin_id !== undefined ||
        presensi.status_kehadiran === 'Izin' ||
        presensi.status_kehadiran === 'izin' ||
        presensi.keterangan === 'Izin' ||
        presensi.keterangan === 'izin' ||
        presensi.status_masuk === 'Izin' ||
        presensi.status_masuk === 'izin' ||
        (presensi.keterangan && presensi.keterangan.toLowerCase().includes('izin')) ||
        (presensi.jenis_izin && presensi.jenis_izin.toLowerCase() === 'izin');
      
      // Cek apakah ini Sakit
      const isSakit = 
        presensi.status_kehadiran === 'Sakit' ||
        presensi.status_kehadiran === 'sakit' ||
        presensi.keterangan === 'Sakit' ||
        presensi.keterangan === 'sakit' ||
        (presensi.keterangan && presensi.keterangan.toLowerCase().includes('sakit')) ||
        (presensi.jenis_izin && presensi.jenis_izin.toLowerCase() === 'sakit');
      
      // Cek apakah ini Cuti
      const isCuti = 
        presensi.status_kehadiran === 'Cuti' ||
        presensi.status_kehadiran === 'cuti' ||
        presensi.keterangan === 'Cuti' ||
        presensi.keterangan === 'cuti' ||
        (presensi.keterangan && presensi.keterangan.toLowerCase().includes('cuti')) ||
        (presensi.jenis_izin && presensi.jenis_izin.toLowerCase() === 'cuti');
      
      // Cek apakah ini Hadir
      const hasJamMasuk = presensi.jam_masuk !== null && presensi.jam_masuk !== undefined && presensi.jam_masuk !== '';
      const isHadir = hasJamMasuk && !isIzin && !isSakit && !isCuti;
      
      // Format data pegawai
      const pegawaiData = {
        id: pegawaiId,
        pegawai_id: pegawaiId,
        nama: nama || `Pegawai ${pegawaiId}`,
        nip: presensi.nip,
        jabatan: presensi.jabatan || 'Tidak diketahui',
        wilayah_penugasan: presensi.wilayah_penugasan || 'Tidak diketahui',
        waktu: presensi.jam_masuk || new Date().toISOString(),
        tanggal: presensi.tanggal || state.selectedDate,
        jam_masuk: presensi.jam_masuk,
        jam_pulang: presensi.jam_pulang,
        status_masuk: presensi.status_masuk,
        status_pulang: presensi.status_pulang
      };
      
      // 🔥 PRIORITAS: Izin > Sakit > Cuti > Hadir
      if (isIzin && !izinMap.has(key)) {
        izinMap.set(key, {
          ...pegawaiData,
          status_kehadiran: 'Izin',
          jenis_izin: presensi.jenis_izin || 'Izin',
          keterangan: presensi.keterangan || 'Izin',
          type: 'izin'
        });
      } else if (isSakit && !izinMap.has(key) && !sakitMap.has(key)) {
        sakitMap.set(key, {
          ...pegawaiData,
          status_kehadiran: 'Sakit',
          jenis_izin: 'Sakit',
          keterangan: presensi.keterangan || 'Sakit',
          type: 'sakit'
        });
      } else if (isCuti && !izinMap.has(key) && !sakitMap.has(key) && !cutiMap.has(key)) {
        cutiMap.set(key, {
          ...pegawaiData,
          status_kehadiran: 'Cuti',
          jenis_izin: 'Cuti',
          keterangan: presensi.keterangan || 'Cuti',
          type: 'cuti'
        });
      } else if (isHadir && !izinMap.has(key) && !sakitMap.has(key) && !cutiMap.has(key) && !hadirMap.has(key)) {
        hadirMap.set(key, {
          ...pegawaiData,
          type: presensi.status_masuk === 'Terlambat' || presensi.status_masuk === 'Terlambat Berat' ? 'terlambat' : 'hadir'
        });
      }
    });
    
    return {
      izin: Array.from(izinMap.values()),
      sakit: Array.from(sakitMap.values()),
      cuti: Array.from(cutiMap.values()),
      hadir: Array.from(hadirMap.values())
    };
  }, [state.selectedDate]);

  // ==================== FILTER DATA ====================

  const filterBelumAbsen = useCallback((belumAbsenData, kategorisasi) => {
    const { izin, sakit, cuti, hadir } = kategorisasi;
    
    // Kumpulkan semua ID yang sudah teridentifikasi
    const idsTeridentifikasi = new Set();
    
    [...izin, ...sakit, ...cuti, ...hadir].forEach(item => {
      const id = item.id || item.pegawai_id;
      if (id) idsTeridentifikasi.add(id);
      if (item.nama) idsTeridentifikasi.add(item.nama);
    });
    
    // Filter belum absen: hanya yang belum teridentifikasi
    return belumAbsenData.filter(pegawai => {
      const pegawaiId = pegawai.id || pegawai.pegawai_id;
      const pegawaiNama = pegawai.nama;
      
      return !idsTeridentifikasi.has(pegawaiId) && !idsTeridentifikasi.has(pegawaiNama);
    });
  }, []);

  const filterBelumLapor = useCallback((belumLaporData, kategorisasi) => {
    const { izin, sakit, cuti } = kategorisasi;
    
    // Kumpulkan ID yang izin/sakit/cuti (mereka tidak perlu lapor)
    const idsIzinSakitCuti = new Set();
    
    [...izin, ...sakit, ...cuti].forEach(item => {
      const id = item.id || item.pegawai_id;
      if (id) idsIzinSakitCuti.add(id);
      if (item.nama) idsIzinSakitCuti.add(item.nama);
    });
    
    // Filter belum lapor: exclude yang izin/sakit/cuti
    return belumLaporData.filter(pegawai => {
      const pegawaiId = pegawai.id || pegawai.pegawai_id;
      const pegawaiNama = pegawai.nama;
      
      return !idsIzinSakitCuti.has(pegawaiId) && !idsIzinSakitCuti.has(pegawaiNama);
    });
  }, []);

  // ==================== HITUNG STATISTIK ====================

  const calculateStats = useCallback((
    semuaPegawai,
    kategorisasi,
    belumAbsenData,
    belumLaporData,
    kinerjaData
  ) => {
    const { izin, sakit, cuti, hadir } = kategorisasi;
    
    const totalPegawai = semuaPegawai.length;
    const terlambatCount = hadir.filter(h => h.type === 'terlambat').length;
    const tepatWaktuCount = hadir.filter(h => h.type === 'hadir').length;
    
    // Hitung yang sudah lapor kinerja
    const sudahLapor = kinerjaData.sudah_lapor || 0;
    
    // Hitung tanpa keterangan
    const teridentifikasi = 
      tepatWaktuCount + 
      terlambatCount + 
      izin.length + 
      sakit.length + 
      cuti.length + 
      belumAbsenData.length;
    
    const tanpaKeterangan = Math.max(0, totalPegawai - teridentifikasi);
    
    console.log('🧮 Calculate Stats:', {
      totalPegawai,
      tepatWaktu: tepatWaktuCount,
      terlambat: terlambatCount,
      izin: izin.length,
      sakit: sakit.length,
      cuti: cuti.length,
      belumAbsen: belumAbsenData.length,
      teridentifikasi,
      tanpaKeterangan
    });
    
    return {
      totalPegawai,
      hadir: tepatWaktuCount,
      terlambat: terlambatCount,
      tepatWaktu: tepatWaktuCount,
      izin: izin.length,
      sakit: sakit.length,
      cuti: cuti.length,
      belumAbsen: belumAbsenData.length,
      belumLapor: belumLaporData.length,
      sudahLapor,
      tanpaKeterangan
    };
  }, []);

  // ==================== FETCH DATA ====================

  const fetchMonitoringData = useCallback(async (tanggal) => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: { data: true, stats: true },
        selectedDate: tanggal
      }));
      
      console.log('🔄 Fetching monitoring data untuk tanggal:', tanggal);
      
      // 🔥 Ambil data master pegawai
      let masterPegawaiData = [];
      try {
        const masterPegawaiRes = await dashboardService.getAllPegawai?.() || 
                                 { data: { data: [] } };
        masterPegawaiData = masterPegawaiRes.data?.data || [];
        console.log('✅ Data master pegawai:', masterPegawaiData.length);
      } catch (masterErr) {
        console.warn('⚠️ Gagal mengambil data master pegawai:', masterErr);
      }
      
      // Fetch data dari multiple endpoints
      const [belumAbsenRes, kinerjaRes, presensiRes] = await Promise.all([
        dashboardService.getPegawaiBelumAbsen(tanggal),
        dashboardService.getKinerjaHariIni(tanggal),
        dashboardService.getPresensiHarian(tanggal)
      ]);
      
      // Parse response
      const belumAbsenData = belumAbsenRes.data?.data || belumAbsenRes.data || [];
      const kinerjaData = kinerjaRes.data?.data || kinerjaRes.data || {};
      const presensiHarianData = presensiRes.data?.data || presensiRes.data || [];
      
      console.log('✅ Data berhasil diambil:', {
        belumAbsen: belumAbsenData.length,
        kinerja: kinerjaData,
        presensi: presensiHarianData.length
      });
      
      // 🔥 Kategorikan presensi dengan prioritas (tanpa duplikasi)
      const kategorisasi = kategorikanPresensi(presensiHarianData);
      
      console.log('📊 Kategorisasi presensi:', {
        izin: kategorisasi.izin.length,
        sakit: kategorisasi.sakit.length,
        cuti: kategorisasi.cuti.length,
        hadir: kategorisasi.hadir.length
      });
      
      // 🔥 Tentukan sumber data untuk total pegawai
      let semuaPegawaiList = [];
      
      if (masterPegawaiData && masterPegawaiData.length > 0) {
        semuaPegawaiList = masterPegawaiData;
        console.log('👥 Menggunakan data master pegawai:', semuaPegawaiList.length);
      } else {
        // Buat map untuk menghindari duplikasi
        const pegawaiMap = new Map();
        
        // Tambahkan dari belumAbsenData
        belumAbsenData.forEach(p => {
          const id = p.id || p.pegawai_id;
          const key = id || p.nama;
          if (key && !pegawaiMap.has(key)) {
            pegawaiMap.set(key, {
              id: id,
              pegawai_id: p.pegawai_id,
              nama: p.nama,
              nip: p.nip,
              jabatan: p.jabatan,
              wilayah_penugasan: p.wilayah_penugasan
            });
          }
        });
        
        semuaPegawaiList = Array.from(pegawaiMap.values());
        console.log('👥 Total pegawai unik (fallback):', semuaPegawaiList.length);
      }
      
      // 🔥 Filter data belum absen
      const filteredBelumAbsen = filterBelumAbsen(
        belumAbsenData, 
        kategorisasi
      );
      
      // 🔥 Filter data belum lapor
      const belumLaporOriginal = kinerjaData.daftar_belum_lapor || [];
      const filteredBelumLapor = filterBelumLapor(
        belumLaporOriginal, 
        kategorisasi
      );
      
      // 🔥 Hitung statistik
      const finalStats = calculateStats(
        semuaPegawaiList,
        kategorisasi,
        filteredBelumAbsen,
        filteredBelumLapor,
        kinerjaData
      );
      
      console.log('📊 Statistik final:', finalStats);
      
      // Update state
      setState(prev => ({
        ...prev,
        semuaPegawai: semuaPegawaiList,
        presensiData: presensiHarianData,
        kinerjaData: kinerjaData,
        dataBelumAbsen: filteredBelumAbsen,
        dataBelumLapor: filteredBelumLapor,
        dataIzin: kategorisasi.izin,
        dataSakit: kategorisasi.sakit,
        dataCuti: kategorisasi.cuti,
        stats: finalStats,
        lastUpdated: new Date().toISOString(),
        loading: { data: false, stats: false }
      }));
      
      return {
        success: true,
        data: {
          semuaPegawai: semuaPegawaiList,
          belumAbsen: filteredBelumAbsen,
          belumLapor: filteredBelumLapor,
          izin: kategorisasi.izin,
          sakit: kategorisasi.sakit,
          cuti: kategorisasi.cuti,
          stats: finalStats
        }
      };
      
    } catch (err) {
      console.error('❌ Error fetching monitoring data:', err);
      
      // 🔥 DATA FALLBACK - TANPA DUPLIKASI
      const fallbackSemuaPegawai = [
        { id: 101, nama: 'HERUL RAHMAN', wilayah_penugasan: 'Prajekan' },
        { id: 102, nama: 'IWAN SETIAWAN', wilayah_penugasan: 'Klabang' },
        { id: 103, nama: 'JEVIL ASTARA', wilayah_penugasan: 'Klabang' },
        { id: 104, nama: 'MUH. ANAS', wilayah_penugasan: 'Ijen' },
        { id: 105, nama: 'MUH. FATHONI', wilayah_penugasan: 'Botolinggo' },
        { id: 106, nama: 'MUHAKKI', wilayah_penugasan: 'Cermee' },
        { id: 107, nama: 'MUHAMMAD ILZEM M', wilayah_penugasan: 'Prajekan' },
        { id: 108, nama: 'NUR HASAN', wilayah_penugasan: 'Prajekan' },
        { id: 109, nama: 'NURUL HAMDI', wilayah_penugasan: 'Cermee' },
        { id: 110, nama: 'RANDY PRAYOGA', wilayah_penugasan: 'Botolinggo' },
        { id: 111, nama: 'Rudi Sucipto', wilayah_penugasan: 'Prajekan' },
        { id: 112, nama: 'RUDIANTO', wilayah_penugasan: 'Botolinggo' },
        { id: 113, nama: 'SAEFULLAH', wilayah_penugasan: 'Cermee' },
        { id: 114, nama: 'SAIFURRAHMAN', wilayah_penugasan: 'Prajekan' },
        { id: 115, nama: 'SOFYAN ISLAMI', wilayah_penugasan: 'Cermee' },
        { id: 116, nama: 'SUBUR DUNIA', wilayah_penugasan: 'Cermee' },
        { id: 117, nama: 'YOFAN AFANDI A', wilayah_penugasan: 'Klabang' },
        { id: 118, nama: 'YULIUS EDAR M', wilayah_penugasan: 'Botolinggo' },
        { id: 119, nama: 'ZAENUR RACHMAN', wilayah_penugasan: 'Prajekan' },
        { id: 120, nama: 'ZAKKI AMIN', wilayah_penugasan: 'Prajekan' },
        { id: 121, nama: 'HERIK SWANDI', wilayah_penugasan: 'Cermee' }
      ];
      
      // 🔥 PASTIKAN TIDAK ADA DUPLIKASI: Setiap pegawai hanya dalam SATU kategori
      const totalPegawai = fallbackSemuaPegawai.length;
      
      // Kategorikan dengan prioritas: Izin > Sakit > Cuti > Hadir > Belum Absen
      const izinSimulasi = [
        {
          id: 121,
          nama: 'HERIK SWANDI',
          wilayah_penugasan: 'Cermee',
          status_kehadiran: 'Izin',
          keterangan: 'Izin',
          type: 'izin'
        }
      ];
      
      const sakitSimulasi = []; // Kosong karena HERIK SWANDI sudah masuk Izin
      
      const cutiSimulasi = [
        {
          id: 116,
          nama: 'SUBUR DUNIA',
          wilayah_penugasan: 'Cermee',
          status_kehadiran: 'Cuti',
          keterangan: 'Cuti',
          type: 'cuti'
        }
      ];
      
      // Sisa pegawai untuk hadir dan belum absen
      const idsSudahTerpakai = new Set([
        ...izinSimulasi.map(p => p.id),
        ...sakitSimulasi.map(p => p.id),
        ...cutiSimulasi.map(p => p.id)
      ]);
      
      const hadirSimulasi = fallbackSemuaPegawai
        .filter(p => !idsSudahTerpakai.has(p.id) && p.id !== 101 && p.id !== 102) // Contoh: 2 orang hadir
        .slice(0, 2)
        .map(p => ({
          id: p.id,
          nama: p.nama,
          wilayah_penugasan: p.wilayah_penugasan,
          status_masuk: 'Tepat Waktu',
          jam_masuk: '08:00:00',
          type: 'hadir'
        }));
      
      hadirSimulasi.forEach(p => idsSudahTerpakai.add(p.id));
      
      const belumAbsenSimulasi = fallbackSemuaPegawai
        .filter(p => !idsSudahTerpakai.has(p.id))
        .map(p => ({
          id: p.id,
          nama: p.nama,
          wilayah_penugasan: p.wilayah_penugasan,
          status_kehadiran: 'Belum Absen',
          type: 'belum-absen'
        }));
      
      // Buat daftar belum lapor (semua kecuali yang izin/sakit/cuti)
      const idsIzinSakitCuti = new Set([
        ...izinSimulasi.map(p => p.id),
        ...sakitSimulasi.map(p => p.id),
        ...cutiSimulasi.map(p => p.id)
      ]);
      
      const belumLaporSimulasi = fallbackSemuaPegawai
        .filter(p => !idsIzinSakitCuti.has(p.id))
        .map(p => ({
          id: p.id,
          nama: p.nama,
          wilayah_penugasan: p.wilayah_penugasan,
          status_kehadiran: 'Belum Lapor Kinerja',
          total_kinerja: 0,
          type: 'belum-lapor'
        }));
      
      // Hitung statistik fallback
      const fallbackStats = {
        totalPegawai: totalPegawai,
        hadir: hadirSimulasi.length,
        terlambat: 0,
        tepatWaktu: hadirSimulasi.length,
        izin: izinSimulasi.length,
        sakit: sakitSimulasi.length,
        cuti: cutiSimulasi.length,
        belumAbsen: belumAbsenSimulasi.length,
        belumLapor: belumLaporSimulasi.length,
        sudahLapor: 0,
        tanpaKeterangan: 0
      };
      
      console.log('📊 Fallback stats (tanpa duplikasi):', fallbackStats);
      
      setState(prev => ({
        ...prev,
        semuaPegawai: fallbackSemuaPegawai,
        dataBelumAbsen: belumAbsenSimulasi,
        dataBelumLapor: belumLaporSimulasi,
        dataIzin: izinSimulasi,
        dataSakit: sakitSimulasi,
        dataCuti: cutiSimulasi,
        stats: fallbackStats,
        lastUpdated: new Date().toISOString(),
        loading: { data: false, stats: false }
      }));
      
      Swal.fire({
        icon: 'warning',
        title: 'Data Simulasi',
        text: `Menggunakan data simulasi (${totalPegawai} pegawai) karena terjadi error koneksi`,
        confirmButtonText: 'Oke',
        confirmButtonColor: '#F59E0B',
      });
      
      return {
        success: false,
        error: err.message,
        data: {
          semuaPegawai: fallbackSemuaPegawai,
          belumAbsen: belumAbsenSimulasi,
          belumLapor: belumLaporSimulasi,
          izin: izinSimulasi,
          sakit: sakitSimulasi,
          cuti: cutiSimulasi,
          stats: fallbackStats
        }
      };
    }
  }, [
    kategorikanPresensi,
    filterBelumAbsen,
    filterBelumLapor,
    calculateStats
  ]);

  // ==================== HANDLE DATE CHANGE ====================

  const handleDateChange = useCallback((e) => {
    const newDate = e.target.value;
    setState(prev => ({ ...prev, selectedDate: newDate }));
    fetchMonitoringData(newDate);
  }, [fetchMonitoringData]);

  // ==================== REFRESH DATA ====================

  const refreshData = useCallback(() => {
    fetchMonitoringData(state.selectedDate);
  }, [fetchMonitoringData, state.selectedDate]);

  // ==================== EXPORT DATA ====================

  const handleExportData = useCallback(() => {
    const { 
      dataBelumAbsen, 
      dataBelumLapor, 
      dataIzin, 
      dataSakit, 
      dataCuti, 
      selectedDate,
      stats
    } = state;
    
    const semuaData = [
      ...dataBelumAbsen.map(item => ({...item, status: 'Belum Absen'})),
      ...dataBelumLapor.map(item => ({...item, status: 'Belum Lapor Kinerja'})),
      ...dataIzin.map(item => ({...item, status: 'Izin'})),
      ...dataSakit.map(item => ({...item, status: 'Sakit'})),
      ...dataCuti.map(item => ({...item, status: 'Cuti'}))
    ];
    
    if (semuaData.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Tidak Ada Data',
        text: 'Tidak ada data untuk diekspor',
        confirmButtonText: 'Oke'
      });
      return;
    }
    
    const headers = ['Nama', 'NIP', 'Jabatan', 'Wilayah', 'Status', 'Keterangan', 'Waktu'];
    const csvData = semuaData.map(item => [
      item.nama || '',
      item.nip || '',
      item.jabatan || '',
      item.wilayah_penugasan || '',
      item.status || item.type || '',
      item.keterangan || '',
      item.waktu ? new Date(item.waktu).toLocaleTimeString('id-ID') : ''
    ]);

    // Tambahkan baris ringkasan
    csvData.push([
      'RINGKASAN',
      '',
      '',
      '',
      `Total Pegawai: ${stats.totalPegawai}`,
      `Hadir: ${stats.hadir}`,
      `Izin: ${stats.izin}`,
      `Sakit: ${stats.sakit}`,
      `Cuti: ${stats.cuti}`,
      `Belum Absen: ${stats.belumAbsen}`,
      `Belum Lapor: ${stats.belumLapor}`,
      `Tanpa Keterangan: ${stats.tanpaKeterangan}`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `monitoring_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Data berhasil diekspor (${semuaData.length} baris data + ringkasan)`,
      confirmButtonText: 'Oke',
      confirmButtonColor: '#10B981',
      timer: 2000
    });
  }, [state]);

  // ==================== GET STATISTIK DETAIL ====================

  const getStatistikDetail = useCallback(() => {
    const { stats } = state;
    
    return [
      { label: 'Total Pegawai', value: stats.totalPegawai, color: 'blue' },
      { label: 'Hadir Tepat Waktu', value: stats.tepatWaktu, color: 'green' },
      { label: 'Terlambat', value: stats.terlambat, color: 'orange' },
      { label: 'Izin', value: stats.izin, color: 'purple' },
      { label: 'Sakit', value: stats.sakit, color: 'pink' },
      { label: 'Cuti', value: stats.cuti, color: 'indigo' },
      { label: 'Belum Absen', value: stats.belumAbsen, color: 'yellow' },
      { label: 'Belum Lapor', value: stats.belumLapor, color: 'red' },
      { label: 'Tanpa Keterangan', value: stats.tanpaKeterangan, color: 'gray' },
    ];
  }, [state.stats]);

  // ==================== GET PERSENTASE ====================

  const getPersentase = useCallback((value, total = state.stats.totalPegawai) => {
    if (!total || total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  }, [state.stats.totalPegawai]);

  // ==================== EFFECT UNTUK AUTO REFRESH ====================

  useEffect(() => {
    fetchMonitoringData(state.selectedDate);
    
    const interval = setInterval(() => {
      console.log('🔄 Auto refresh monitoring data');
      fetchMonitoringData(state.selectedDate);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ==================== RETURN ====================

  return {
    selectedDate: state.selectedDate,
    dataBelumAbsen: state.dataBelumAbsen,
    dataBelumLapor: state.dataBelumLapor,
    dataIzin: state.dataIzin,
    dataSakit: state.dataSakit,
    dataCuti: state.dataCuti,
    semuaPegawai: state.semuaPegawai,
    presensiData: state.presensiData,
    kinerjaData: state.kinerjaData,
    loading: state.loading,
    stats: state.stats,
    lastUpdated: state.lastUpdated,
    
    handleDateChange,
    fetchMonitoringData,
    refreshData,
    handleExportData,
    getStatistikDetail,
    getPersentase,
    
    formatDate
  };
}