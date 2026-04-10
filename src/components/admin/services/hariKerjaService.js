import api from '@/lib/api';

export const hariKerjaService = {
  getAll: (params) => api.get('hari-kerja', { params }),
  getByBulan: (bulan, tahun) => api.get(`hari-kerja/bulan?bulan=${bulan}&tahun=${tahun}`),
  getHariIni: () => api.get('hari-kerja/hari-ini'),
};