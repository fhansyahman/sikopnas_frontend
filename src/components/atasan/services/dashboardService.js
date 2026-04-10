import api from '@/lib/api';

export const dashboardService = {
  getPegawaiBelumAbsen: (tanggal) => 
    api.get(`admin/dashboard/pegawai-belum-absen?tanggal=${tanggal}`),
  
  getKinerjaHariIni: (tanggal) => 
    api.get(`admin/dashboard/kinerja-hari-ini?tanggal=${tanggal}`),
  
  getPresensiHarian: (tanggal) =>
    api.get(`admin/presensi?tanggal=${tanggal}`),
  
  getKehadiranHariIni: (tanggal) => 
    api.get(`admin/dashboard/kehadiran-hari-ini?tanggal=${tanggal}`),
  
  getRekapKinerjaBulanan: (bulan, tahun) =>
    api.get(`admin/kinerja/rekap-bulanan?bulan=${bulan}&tahun=${tahun}`),
  
  getStatistikKinerja: (bulan, tahun) =>
    api.get(`admin/kinerja/statistik?bulan=${bulan}&tahun=${tahun}`),
};