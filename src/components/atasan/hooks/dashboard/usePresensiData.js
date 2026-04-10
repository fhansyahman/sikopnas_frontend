import { useState, useCallback, useEffect, useRef } from "react";
import { adminPresensiAPI } from "@/lib/api";
import { WILAYAH_LIST, BULAN_OPTIONS, getTahunOptions } from "../../utils/dashboard/constants";
import Swal from "sweetalert2";

export function usePresensiData() {
  const [state, setState] = useState({
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    selectedWilayah: 'all',
    presensiData: [],
    rekapPerPegawai: [],
    chartData: null,
    loading: false,
    periodeInfo: null,
    statistik: {
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
    wilayahStatistik: {}
  });

  const isMounted = useRef(true);
  const isProcessing = useRef(false);
  const lastParams = useRef({ bulan: null, tahun: null, wilayah: null });

  // ==================== LOAD DATA ====================

  const loadPresensiData = useCallback(async () => {
    const bulan = state.selectedMonth;
    const tahun = state.selectedYear;
    const wilayah = state.selectedWilayah === 'all' ? null : state.selectedWilayah;
    
    if (isProcessing.current) {
      console.log('⏳ Already processing, skipping...');
      return;
    }
    
    if (lastParams.current.bulan === bulan && 
        lastParams.current.tahun === tahun && 
        lastParams.current.wilayah === wilayah && 
        state.rekapPerPegawai.length > 0) {
      console.log('📊 Data already loaded for this period, skipping...');
      return;
    }
    
    isProcessing.current = true;
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const params = {
        bulan: bulan.toString().padStart(2, '0'),
        tahun: tahun.toString()
      };
      
      if (wilayah) {
        params.wilayah = wilayah;
      }
      
      console.log('📡 Fetching presensi per bulan with params:', params);
      const response = await adminPresensiAPI.getPerBulan(params);
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        
        if (isMounted.current) {
          // Ambil data dari API
          const rekapPerPegawai = data.rekap_per_pegawai || [];
          const allPresensi = data.all_presensi || [];
          const apiStatistik = data.statistik || {};
          const apiPeriode = data.periode || {};
          
          // Hitung ulang statistik per wilayah dari rekap per pegawai
          const wilayahStats = {};
          WILAYAH_LIST.forEach(wil => {
            wilayahStats[wil] = {
              totalPegawai: 0,
              totalHadir: 0,
              totalTerlambat: 0,
              totalIzin: 0,
              totalTanpaKeterangan: 0,
              totalPresensi: 0,
              persenHadir: 0,
              persenTerlambat: 0,
              persenIzin: 0,
              persenTanpaKeterangan: 0
            };
          });
          
          let totalHadirOverall = 0;
          let totalTerlambatOverall = 0;
          let totalIzinOverall = 0;
          let totalTanpaKeteranganOverall = 0;
          let totalPegawaiOverall = 0;
          
          // Hitung dari rekap per pegawai
          rekapPerPegawai.forEach(pegawai => {
            const wilayah = pegawai.wilayah || 'Unknown';
            if (wilayahStats[wilayah]) {
              wilayahStats[wilayah].totalPegawai++;
              wilayahStats[wilayah].totalHadir += pegawai.total_hadir || 0;
              wilayahStats[wilayah].totalTerlambat += pegawai.total_terlambat || 0;
              wilayahStats[wilayah].totalIzin += pegawai.total_izin || 0;
              wilayahStats[wilayah].totalTanpaKeterangan += pegawai.total_tanpa_keterangan || 0;
              wilayahStats[wilayah].totalPresensi += (pegawai.total_hari_lapor || 0);
              
              totalHadirOverall += pegawai.total_hadir || 0;
              totalTerlambatOverall += pegawai.total_terlambat || 0;
              totalIzinOverall += pegawai.total_izin || 0;
              totalTanpaKeteranganOverall += pegawai.total_tanpa_keterangan || 0;
              totalPegawaiOverall++;
            }
          });
          
          // Hitung persentase per wilayah
          Object.keys(wilayahStats).forEach(wilayah => {
            const stats = wilayahStats[wilayah];
            const totalPresensiWilayah = stats.totalPresensi;
            if (totalPresensiWilayah > 0) {
              stats.persenHadir = Math.round((stats.totalHadir / totalPresensiWilayah) * 100);
              stats.persenTerlambat = Math.round((stats.totalTerlambat / totalPresensiWilayah) * 100);
              stats.persenIzin = Math.round((stats.totalIzin / totalPresensiWilayah) * 100);
              stats.persenTanpaKeterangan = Math.round((stats.totalTanpaKeterangan / totalPresensiWilayah) * 100);
            }
          });
          
          // Hitung persentase overall
          const totalPresensiOverall = totalHadirOverall + totalTerlambatOverall + totalIzinOverall + totalTanpaKeteranganOverall;
          const overallStats = {
            totalPegawai: totalPegawaiOverall,
            totalHadir: totalHadirOverall,
            totalTerlambat: totalTerlambatOverall,
            totalIzin: totalIzinOverall,
            totalTanpaKeterangan: totalTanpaKeteranganOverall,
            persenHadir: totalPresensiOverall > 0 ? Math.round((totalHadirOverall / totalPresensiOverall) * 100) : 0,
            persenTerlambat: totalPresensiOverall > 0 ? Math.round((totalTerlambatOverall / totalPresensiOverall) * 100) : 0,
            persenIzin: totalPresensiOverall > 0 ? Math.round((totalIzinOverall / totalPresensiOverall) * 100) : 0,
            persenTanpaKeterangan: totalPresensiOverall > 0 ? Math.round((totalTanpaKeteranganOverall / totalPresensiOverall) * 100) : 0
          };
          
          // Buat chart data untuk dashboard (per wilayah)
          const wilayahWithData = Object.keys(wilayahStats).filter(wilayah => {
            const stats = wilayahStats[wilayah];
            return stats.totalPresensi > 0;
          });
          
          const chartData = {
            labels: wilayahWithData,
            datasets: [
              {
                label: 'Hadir',
                data: wilayahWithData.map(wilayah => wilayahStats[wilayah].persenHadir),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.8,
                categoryPercentage: 0.7
              },
              {
                label: 'Terlambat',
                data: wilayahWithData.map(wilayah => wilayahStats[wilayah].persenTerlambat),
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: 'rgb(245, 158, 11)',
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.8,
                categoryPercentage: 0.7
              },
              {
                label: 'Izin',
                data: wilayahWithData.map(wilayah => wilayahStats[wilayah].persenIzin),
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
                borderColor: 'rgb(168, 85, 247)',
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.8,
                categoryPercentage: 0.7
              },
              {
                label: 'Tanpa Keterangan',
                data: wilayahWithData.map(wilayah => wilayahStats[wilayah].persenTanpaKeterangan),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.8,
                categoryPercentage: 0.7
              }
            ]
          };
          
          setState(prev => ({
            ...prev,
            presensiData: allPresensi,
            rekapPerPegawai: rekapPerPegawai,
            chartData: chartData,
            periodeInfo: apiPeriode,
            statistik: overallStats,
            wilayahStatistik: wilayahStats,
            loading: false
          }));
          
          lastParams.current = { bulan, tahun, wilayah };
        }
      } else {
        throw new Error(response.data?.message || 'Gagal memuat data');
      }
      
    } catch (error) {
      console.error('Error loading presensi data:', error);
      if (isMounted.current) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data presensi',
          text: error.response?.data?.message || error.message || 'Terjadi kesalahan saat memuat data presensi',
          confirmButtonText: 'Coba Lagi',
          confirmButtonColor: '#EF4444',
        });
        setState(prev => ({ ...prev, loading: false }));
      }
    } finally {
      isProcessing.current = false;
    }
  }, [state.selectedMonth, state.selectedYear, state.selectedWilayah, state.rekapPerPegawai.length]);

  // ==================== HANDLE CHANGE ====================

  const handleMonthChange = useCallback((month) => {
    setState(prev => ({ 
      ...prev, 
      selectedMonth: parseInt(month),
      rekapPerPegawai: []
    }));
  }, []);

  const handleYearChange = useCallback((year) => {
    setState(prev => ({ 
      ...prev, 
      selectedYear: parseInt(year),
      rekapPerPegawai: []
    }));
  }, []);

  const handleWilayahChange = useCallback((wilayah) => {
    setState(prev => ({ 
      ...prev, 
      selectedWilayah: wilayah,
      rekapPerPegawai: []
    }));
  }, []);

  // ==================== NAVIGASI BULAN ====================

  const goToPreviousMonth = useCallback(() => {
    let newMonth = state.selectedMonth - 1;
    let newYear = state.selectedYear;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    setState(prev => ({ 
      ...prev, 
      selectedMonth: newMonth,
      selectedYear: newYear,
      rekapPerPegawai: []
    }));
  }, [state.selectedMonth, state.selectedYear]);

  const goToNextMonth = useCallback(() => {
    let newMonth = state.selectedMonth + 1;
    let newYear = state.selectedYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    
    setState(prev => ({ 
      ...prev, 
      selectedMonth: newMonth,
      selectedYear: newYear,
      rekapPerPegawai: []
    }));
  }, [state.selectedMonth, state.selectedYear]);

  const goToCurrentMonth = useCallback(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    setState(prev => ({ 
      ...prev, 
      selectedMonth: currentMonth,
      selectedYear: currentYear,
      rekapPerPegawai: []
    }));
  }, []);

  // ==================== EXPORT FUNCTIONS ====================

  const handleExportChart = () => {
    if (!state.chartData) {
      Swal.fire({
        icon: 'info',
        title: 'Tidak Ada Grafik',
        text: 'Tidak ada data grafik untuk diekspor',
        confirmButtonText: 'Oke'
      });
      return;
    }

    const chartContainer = document.getElementById('presensiChartContainer');
    if (chartContainer) {
      const canvas = chartContainer.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        const bulanLabel = BULAN_OPTIONS.find(b => b.value === state.selectedMonth.toString().padStart(2, '0'))?.label || state.selectedMonth;
        const fileName = `grafik-presensi-${bulanLabel}-${state.selectedYear}.png`;
        
        link.download = fileName;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Grafik berhasil diekspor sebagai ${fileName}`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#10B981',
          timer: 2000
        });
      }
    }
  };

  const handleExportData = () => {
    const { wilayahStatistik, statistik, selectedMonth, selectedYear, rekapPerPegawai, periodeInfo } = state;
    
    if (!rekapPerPegawai || rekapPerPegawai.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Tidak Ada Data',
        text: 'Tidak ada data untuk diekspor',
        confirmButtonText: 'Oke'
      });
      return;
    }

    const bulanLabel = BULAN_OPTIONS.find(b => b.value === selectedMonth.toString().padStart(2, '0'))?.label || selectedMonth;
    const tanggalExport = new Date().toLocaleDateString('id-ID');
    
    // Header CSV untuk statistik per wilayah
    const headers = [
      `Laporan Presensi ${bulanLabel} ${selectedYear}`,
      `Total Hari Kerja: ${periodeInfo?.total_hari_kerja || '-'}`,
      `Tanggal Export: ${tanggalExport}`,
      '',
      'Wilayah',
      'Hadir',
      'Terlambat',
      'Izin',
      'Tanpa Keterangan',
      'Total',
      'Tingkat Kehadiran',
      'Status'
    ];
    
    // Data per wilayah
    const csvData = Object.keys(wilayahStatistik)
      .filter(wilayah => {
        const stats = wilayahStatistik[wilayah];
        return stats.totalPresensi > 0;
      })
      .map(wilayah => {
        const stats = wilayahStatistik[wilayah];
        const total = stats.totalPresensi;
        const tingkatKehadiran = stats.persenHadir || 0;
        const status = tingkatKehadiran >= 80 ? 'Baik' : tingkatKehadiran >= 60 ? 'Cukup' : 'Perlu Perhatian';
        
        return [
          wilayah,
          `${stats.totalHadir}(${stats.persenHadir}%)`,
          `${stats.totalTerlambat}(${stats.persenTerlambat}%)`,
          `${stats.totalIzin}(${stats.persenIzin}%)`,
          `${stats.totalTanpaKeterangan}(${stats.persenTanpaKeterangan}%)`,
          total,
          `${tingkatKehadiran}%`,
          status
        ];
      });

    // Baris total
    const totalPresensi = statistik.totalHadir + statistik.totalTerlambat + statistik.totalIzin + statistik.totalTanpaKeterangan;
    const tingkatKehadiranOverall = statistik.persenHadir || 0;
    const statusOverall = tingkatKehadiranOverall >= 80 ? 'Baik' : tingkatKehadiranOverall >= 60 ? 'Cukup' : 'Perlu Perhatian';
    
    csvData.push([
      'TOTAL',
      `${statistik.totalHadir}(${statistik.persenHadir}%)`,
      `${statistik.totalTerlambat}(${statistik.persenTerlambat}%)`,
      `${statistik.totalIzin}(${statistik.persenIzin}%)`,
      `${statistik.totalTanpaKeterangan}(${statistik.persenTanpaKeterangan}%)`,
      totalPresensi,
      `${tingkatKehadiranOverall}%`,
      statusOverall
    ]);

    // Buat konten CSV
    const csvContent = headers.join('\n') + '\n' + csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    // Download file
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `presensi-${bulanLabel}-${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Data berhasil diekspor (${csvData.length} baris)`,
      confirmButtonText: 'Oke',
      confirmButtonColor: '#10B981',
      timer: 2000
    });
  };

  // ==================== GET STATISTIK ====================

  const getStatistikDetail = useCallback(() => {
    const { statistik } = state;
    
    return [
      { label: 'Total Presensi', value: statistik.totalHadir + statistik.totalTerlambat + statistik.totalIzin + statistik.totalTanpaKeterangan, color: 'blue' },
      { label: 'Hadir', value: statistik.totalHadir, color: 'green' },
      { label: 'Terlambat', value: statistik.totalTerlambat, color: 'orange' },
      { label: 'Izin', value: statistik.totalIzin, color: 'purple' },
      { label: 'Tanpa Keterangan', value: statistik.totalTanpaKeterangan, color: 'red' }
    ];
  }, [state.statistik]);

  const getPersentase = useCallback((value, total = state.statistik.totalHadir + state.statistik.totalTerlambat + state.statistik.totalIzin + state.statistik.totalTanpaKeterangan) => {
    if (!total || total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  }, [state.statistik]);

  const getBulanLabel = useCallback((month) => {
    const bulan = BULAN_OPTIONS.find(b => b.value === month.toString().padStart(2, '0'));
    return bulan ? bulan.label : month;
  }, []);

  // ==================== EFFECT ====================

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      isProcessing.current = false;
    };
  }, []);

  useEffect(() => {
    loadPresensiData();
  }, [loadPresensiData]);

  // ==================== RETURN ====================

  return {
    // State
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,
    selectedWilayah: state.selectedWilayah,
    presensiData: state.presensiData,
    rekapPerPegawai: state.rekapPerPegawai,
    chartData: state.chartData,
    loading: state.loading,
    periodeInfo: state.periodeInfo,
    statistik: state.statistik,
    wilayahStatistik: state.wilayahStatistik,
    
    // Functions
    loadPresensiData,
    handleMonthChange,
    handleYearChange,
    handleWilayahChange,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    handleExportChart,
    handleExportData,
    getStatistikDetail,
    getPersentase,
    getBulanLabel,
    
    // Options
    bulanOptions: BULAN_OPTIONS,
    tahunOptions: getTahunOptions(),
    wilayahOptions: [{ value: 'all', label: 'Semua Wilayah' }, ...WILAYAH_LIST.map(w => ({ value: w, label: w }))]
  };
}