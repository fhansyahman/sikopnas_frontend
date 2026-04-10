import api from '@/lib/api';

export const presensiService = {
  getAll: (params) => api.get('admin/presensi', { params }),
  getByPegawai: (pegawaiId, params) => api.get(`admin/presensi/pegawai/${pegawaiId}`, { params }),
  getHarian: (tanggal) => api.get(`admin/presensi/harian?tanggal=${tanggal}`),
  getRekapBulanan: (params) => api.get('admin/presensi/rekap-bulanan', { params }),
};