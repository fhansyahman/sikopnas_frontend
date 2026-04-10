import axios from 'axios';
import { adminPresensiAPI, adminKinerjaAPI, usersAPI, hariAPI } from '@/lib/api';

// Dashboard API functions
export const dashboardAPI = {
  getPegawaiBelumAbsen: (tanggal) => 
    adminPresensiAPI.getPegawaiBelumAbsen?.(tanggal) || 
    axios.get(`/api/admin/dashboard/pegawai-belum-absen?tanggal=${tanggal}`),
  
  getKinerjaHariIni: (tanggal) => 
    adminKinerjaAPI.getKinerjaHariIni?.(tanggal) ||
    axios.get(`/api/admin/dashboard/kinerja-hari-ini?tanggal=${tanggal}`),
  
  getPresensiHarian: (tanggal) =>
    adminPresensiAPI.getPresensiHarian?.(tanggal) ||
    axios.get(`/api/admin/presensi?tanggal=${tanggal}`),
  
  getKehadiranHariIni: (tanggal) => 
    adminPresensiAPI.getKehadiranHariIni?.(tanggal) ||
    axios.get(`/api/admin/dashboard/kehadiran-hari-ini?tanggal=${tanggal}`),
};

// Presensi API
export const fetchPresensiData = async (params = {}) => {
  try {
    const response = await adminPresensiAPI.getAll(params);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching presensi:', error);
    throw error;
  }
};

// Pegawai API
export const fetchPegawaiData = async () => {
  try {
    const response = await usersAPI.getAll();
    const usersData = response.data?.data || [];
    
    return usersData.filter(user => 
      (user.jabatan?.toLowerCase() === 'pegawai' || user.role === 'pegawai') &&
      user.status?.toLowerCase() === 'aktif'
    );
  } catch (error) {
    console.error('Error fetching pegawai:', error);
    throw error;
  }
};

// Hari Kerja API
export const fetchHariKerjaData = async (bulan, tahun) => {
  try {
    const params = { bulan, tahun };
    const response = await hariAPI.getAllHariKerja(params);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching hari kerja:', error);
    throw error;
  }
};

// Kinerja API
export const fetchKinerjaData = async (params) => {
  try {
    const response = await adminKinerjaAPI.getAll(params);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching kinerja:', error);
    throw error;
  }
};