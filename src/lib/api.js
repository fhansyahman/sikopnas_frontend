import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sikopnas.web.id/api' ;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const adminDashboardAPI = {
  getKinerjaBulanan: (tahun, bulan, wilayah = '') => {
    let url = `admin/dashboard/kinerja-bulanan?tahun=${tahun}&bulan=${bulan}`;
    if (wilayah && wilayah !== 'all') {
      url += `&wilayah=${wilayah}`;
    }
    return api.get(url);
  },
  getWilayah: () => api.get('admin/wilayah'),
};

// Response interceptor untuk handle token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  resetPassword: (data) => api.put('/auth/reset-password', data),
};


export const presensiAPI = {
  masuk: (data) => api.post('/presensi/masuk', data),
  pulang: (data) => api.post('/presensi/pulang', data),
  getHariIni: () => api.get('/presensi/hari-ini'),
  getRiwayat: (bulan, tahun) => api.get('/presensi/riwayat', { params: { bulan, tahun } }),
  getUser: () => api.get('/presensi/user'), // Legacy endpoint
  
  // ENDPOINT BARU (LEBIH EFISIEN)
  getUserPerBulan: (bulan, tahun) => {
    console.log('Calling getUserPerBulan with:', bulan, tahun);
    return api.get('/presensi/perbulan', { params: { bulan, tahun } });
  },
};
export const dashboardAPI = {
  // Kehadiran
  getDashboardHariIni: () =>
    api.get("/dashboard/kehadiran-hari-ini"),

  getGrafikHadirBulanan: (tahun) =>
    api.get("/dashboard/kehadiran-bulanan", {
      params: { tahun },
    }),

  // Kinerja
  getDashboardKinerjaHariIni: () =>
    api.get("/dashboard/kinerja-hari-ini"),

  getGrafikKinerjaBulanan: (tahun) =>
    api.get("/dashboard/kinerja-bulanan", {
      params: { tahun },
    }),
};



export const aktivitasAPI = {
  tambah: (data) => api.post('/aktivitas/tambah', data),
  getSaya: (tanggal) => api.get('/aktivitas/saya', { params: { tanggal } }),
};
// ... kode sebelumnya ...

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updatePassword: (id, password) => api.put(`/users/${id}/password`, { password }),
};

// ... kode setelahnya ...
// ... API lainnya

export const adminPresensiAPI = {

  getAll: (params) => api.get('/admin/presensi', { params }),

  // ✅ FIX: endpoint benar
  getHariIni: () => api.get('/admin/presensi/hari-ini'),
  getById: (id) => api.get(`/admin/presensi/${id}`),

  update: (id, data) =>
    api.put(`/admin/presensi/${id}`, data),

  delete: (id) =>
    api.delete(`/admin/presensi/${id}`),

  generateHariIni: () =>
    api.post('/admin/presensi/generate-hari-ini'),

  getStatistik: (params) =>
    api.get('/admin/presensi/statistik', { params }),

  getStatistikHarian: (params) =>
    api.get('/admin/presensi/statistik/harian', { params }),

  getStatistikBulanan: (params) =>
    api.get('/admin/presensi/statistik/bulanan', { params }),

  getDashboardSummary: () =>
    api.get('/admin/presensi/dashboard/summary'),

  // ============ FUNGSI BARU UNTUK REKAP KEHADIRAN ============
  getRekapBulanan: (params) =>
    api.get('/admin/presensi/rekap-bulanan', { params }),
  
  exportRekapExcel: (params) =>
    api.get('/admin/presensi/export-rekap-excel', { params, responseType: 'blob' }),
  getPerBulan: (params) => api.get('/presensi/admin/perbulan', { params }),
};
export const jamKerjaAPI = {
  getAll: (params) => api.get('/jam-kerja', { params }),
  getById: (id) => api.get(`/jam-kerja/${id}`),
  getAktif: () => api.get('/jam-kerja/aktif'),
  create: (data) => api.post('/jam-kerja', data),
  update: (id, data) => api.put(`/jam-kerja/${id}`, data),
  delete: (id) => api.delete(`/jam-kerja/${id}`),
  assignToUser: (data) => api.post('/jam-kerja/assign', data),
};


// User Jam Kerja API
export const userJamKerjaAPI = {
  getUsersWithJamKerja: () => api.get('/user-jam-kerja/users'),
  getAvailableJamKerja: () => api.get('/user-jam-kerja/available'),
  getUserJamKerja: (user_id) => api.get(`/user-jam-kerja/user/${user_id}`),
  assignJamKerja: (data) => api.post('/user-jam-kerja/assign', data),
  assignJamKerjaBulk: (data) => api.post('/user-jam-kerja/assign-bulk', data),
  removeJamKerja: (data) => api.post('/user-jam-kerja/remove', data),
};


// Izin API
// Izin API
export const izinAPI = {
  // Admin - Get all izin
  getAllIzin: (params) => api.get('/izin/all', { params }),
  // Admin - Get izin per tanggal (BARU)
  getIzinPerTanggal: (params) => api.get('/izin/per-tanggal', { params }),
  // User - Get my izin
  getMyIzin: () => api.get('/izin/saya'),
  // User - Get my izin per bulan
  getMyIzinPerBulan: (bulan, tahun) => api.get('/izin/perbulan', { params: { bulan, tahun } }),
  // Get izin by ID
  getById: (id) => api.get(`/izin/${id}`),
  // Create new izin (user)
  create: (data) => api.post('/izin/ajukan', data),
  // Create izin by admin (for user)
  createByAdmin: (data) => api.post('/izin/admin-create', data),
  // Update izin status (admin)
  updateStatus: (id, status) => api.patch(`/izin/${id}/status`, { status }),
  // Delete izin
  delete: (id) => api.delete(`/izin/${id}`),
 downloadDokumen: (filename) => api.get(`/izin/download/${filename}`),
};
// lib/api.js - Update kinerjaAPI section

export const kinerjaAPI = {
  create: (data) => api.post('/kinerja', data),
  createWithCamera: (data) => api.post('/kinerja/camera', data),
  getMyKinerja: (params) => api.get('/kinerja/my', { params }),
  getMyKinerjaPerBulan: (params) => api.get('/kinerja/perbulan', { params }), // TAMBAHKAN INI
  getById: (id) => api.get(`/kinerja/${id}`),
  update: (id, data) => api.put(`/kinerja/${id}`, data),
  delete: (id) => api.delete(`/kinerja/${id}`),
  getAll: (params) => api.get('/kinerja/admin/all', { params }),
  getStatistik: (params) => api.get('/kinerja/admin/statistik', { params }),
  generatePDF: (id) => api.post(`/kinerja/admin/${id}/generate-pdf`),
  generateRekapWilayah: (data) => api.post('/kinerja/admin/generate-rekap-wilayah', data),
  downloadAllWilayah: (params) => api.get('/kinerja/admin/download-all-wilayah', { params })
};


export const adminKinerjaAPI = {
  getAll: (params) => api.get('/kinerja/admin/all', { params }),
  getPerTanggal: (params) => api.get('/kinerja/admin/per-tanggal', { params }),
  getStatistik: (params) => api.get('/kinerja/admin/statistik', { params }),
  delete: (id) => api.delete(`/kinerja/${id}`),
  generatePDF: (id) => api.post(`/kinerja/admin/${id}/generate-pdf`),
  generateRekapWilayah: (data) => api.post('/kinerja/admin/generate-rekap-wilayah', data),
  downloadAllWilayah: (params) => api.get('/kinerja/admin/download-all-wilayah', { params }),
   // Endpoint untuk per bulan (BARU)
  getPerBulan: (params) => api.get('/kinerja/admin/perbulan', { params }),
};

// Untuk handle download blob
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};


// lib/api.js - Tambahkan bagian wilayah
export const wilayahAPI = {
  // Wilayah management
  getAll: () => api.get('/wilayah'),
  getById: (id) => api.get(`/wilayah/${id}`),
  create: (data) => api.post('/wilayah', data),
  update: (id, data) => api.put(`/wilayah/${id}`, data),
  delete: (id) => api.delete(`/wilayah/${id}`),
  getStats: () => api.get('/wilayah/stats'),
  getAllPegawai: () => api.get('/wilayah/pegawai'),
  
  // User assignment
  getUsersByWilayah: (wilayah_id) => api.get(`/wilayah/${wilayah_id}/users`),
  assignToUser: (user_id, data) => api.put(`/wilayah/user/${user_id}/assign`, data),
};

// lib/api.js - Tambahkan bagian hari
export const hariAPI = {
  // Hari Kerja
  getAllHariKerja: (params = {}) => api.get('/hari/hari-kerja', { params }),
  createHariKerja: (data) => api.post('/hari/hari-kerja', data),
  updateHariKerja: (id, data) => api.put(`/hari/hari-kerja/${id}`, data),
  deleteHariKerja: (id) => api.delete(`/hari/hari-kerja/${id}`),
  bulkCreateHariKerja: (data) => api.post('/hari/hari-kerja/bulk', data),
  
  // Hari Libur
  getAllHariLibur: (params = {}) => api.get('/hari/hari-libur', { params }),
  createHariLibur: (data) => api.post('/hari/hari-libur', data),
  updateHariLibur: (id, data) => api.put(`/hari/hari-libur/${id}`, data),
  deleteHariLibur: (id) => api.delete(`/hari/hari-libur/${id}`),
  
  // Kalender
  getKalender: (params = {}) => api.get('/hari/kalender', { params }),
};

export const aktifuserAPI = {
  // Get semua pegawai dengan filter
  getAllUsers: (params = {}) => api.get('/aktifuser/all', { params }),
  
  // Get pegawai aktif saja
  getActiveUsers: (params = {}) => api.get('/aktifuser/active', { params }),
  
  // Get pegawai nonaktif saja
  getInactiveUsers: (params = {}) => api.get('/aktifuser/inactive', { params }),
  
  // Get pegawai by IDs
  getUserById: (id) => api.get(`/aktifuser/${id}`),
  
  // Nonaktifkan pegawai
  deactivateUser: (id) => api.patch(`/aktifuser/${id}/deactivate`),
  
  // Aktifkan pegawai
  activateUser: (id) => api.patch(`/aktifuser/${id}/activate`),
  
  // Update status pegawai
  updateUserStatus: (id, data) => api.patch(`/aktifuser/${id}/status`, data),
};
// lib/api.js - Tambahkan pemutihanAPI
export const pemutihanAPI = {
  // Get data untuk pemutihan
  getDataForPemutihan: (params) => {
    return api.get('/pemutihan/data', { params });
  },
  
  // Proses pemutihan
  prosesPemutihan: (data) => {
    return api.post('/pemutihan/proses', data);
  },
  
  // Batalkan pemutihan
  batalkanPemutihan: (data) => {
    return api.post('/pemutihan/batal', data);
  },
  
  // Get riwayat pemutihan
  getRiwayatPemutihan: (params) => {
    return api.get('/pemutihan/riwayat', { params });
  }
};

// lib/api.js - Tambahkan adminAktivitasAPI
export const adminAktivitasAPI = {
  // Get all aktivitas dengan pagination dan filter
  getAllAktivitas: (params = {}) => api.get('/admin/aktivitas', { params }),
  
  // Get aktivitas detail
  getAktivitasDetail: (id) => api.get(`/admin/aktivitas/${id}`),
  
  // Create new aktivitas
  createAktivitas: (data) => api.post('/admin/aktivitas', data),
  
  // Update aktivitas
  updateAktivitas: (id, data) => api.put(`/admin/aktivitas/${id}`, data),
  
  // Delete aktivitas
  deleteAktivitas: (id) => api.delete(`/admin/aktivitas/${id}`),
  
  // Bulk delete aktivitas
  bulkDeleteAktivitas: (ids) => api.delete('/admin/aktivitas/bulk/delete', { data: { ids } }),
  
  // Get statistics
  getAktivitasStats: (params = {}) => api.get('/admin/aktivitas/stats', { params }),
  
  // Export data
  exportAktivitas: (params = {}) => api.get('/admin/aktivitas/export', { 
    params,
    responseType: params.format === 'csv' ? 'blob' : 'json'
  }),
};

export const pegawaiAktivitasAPI = {
  // Get all aktivitas untuk pegawai (dengan pagination dan filter)
  getAllAktivitas: (params = {}) => api.get('/pegawai/aktivitas', { params }),
  
  // Get detail aktivitas spesifik
  getAktivitasDetail: (id) => api.get(`/pegawai/aktivitas/${id}`),
  
  // Buat aktivitas baru
  createAktivitas: (data) => api.post('/pegawai/aktivitas', data),
  
  // Update aktivitas
  updateAktivitas: (id, data) => api.put(`/pegawai/aktivitas/${id}`, data),
  
  // Delete aktivitas
  deleteAktivitas: (id) => api.delete(`/pegawai/aktivitas/${id}`),
  
  // Get statistics untuk dashboard pegawai
  getAktivitasStats: (params = {}) => api.get('/pegawai/aktivitas/stats', { params }),
  
  // Get profile pegawai
  getProfile: () => api.get('/pegawai/profile'),
  
  // Update profile pegawai
  updateProfile: (data) => api.put('/pegawai/profile', data),
};
// lib/api.js - Tambahkan Telegram API
export const telegramAPI = {
  getStatus: () => api.get('/telegram/status'),
  disconnect: () => api.post('/telegram/disconnect'),
};
export default api;