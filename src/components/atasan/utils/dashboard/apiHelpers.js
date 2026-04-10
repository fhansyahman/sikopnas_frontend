import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const createAPI = () => {
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

  // Response interceptor untuk handle error
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const handleApiError = (error, defaultMessage = 'Terjadi kesalahan') => {
  console.error('API Error:', error);
  
  if (error.response) {
    const serverMessage = error.response.data?.message;
    if (serverMessage) {
      return serverMessage;
    }
    
    switch (error.response.status) {
      case 400: return 'Data yang dikirim tidak valid';
      case 401: return 'Sesi telah berakhir, silakan login kembali';
      case 403: return 'Anda tidak memiliki akses ke resource ini';
      case 404: return 'Data tidak ditemukan';
      case 500: return 'Server sedang mengalami masalah';
      default: return `Error ${error.response.status}: ${error.response.statusText}`;
    }
  } else if (error.request) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda';
  } else {
    return error.message || defaultMessage;
  }
};

export const formatApiResponse = (response) => {
  if (response.data?.success) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  }
  
  return {
    success: false,
    data: null,
    message: response.data?.message || 'Request gagal'
  };
};