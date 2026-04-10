"use client";

import { useState, useEffect, useCallback } from "react";
import { aktifuserAPI } from "@/lib/api";
import Swal from "sweetalert2";

export function useUserData() {
  const [usersList, setUsersList] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [statistik, setStatistik] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEmptyStatistik = () => ({
    total_pegawai: 0,
    aktif: 0,
    nonaktif: 0,
    persen_aktif: 0,
    persen_nonaktif: 0,
    wilayah: {},
    chart_data: {
      labels: ['Aktif', 'Nonaktif'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#0DA675', '#DC2626'],
        borderWidth: 1
      }]
    }
  });

  const sortUsersAlphabetically = useCallback((data) => {
    return [...data].sort((a, b) => {
      const nameA = a.nama?.toLowerCase() || '';
      const nameB = b.nama?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });
  }, []);

  const calculateStatistik = useCallback((data) => {
    if (!data || data.length === 0) {
      setStatistik(getEmptyStatistik());
      return;
    }

    const totalPegawai = data.length;
    const aktif = data.filter(u => u.is_active === true || u.is_active === 1).length;
    const nonaktif = data.filter(u => u.is_active === false || u.is_active === 0).length;
    const persenAktif = totalPegawai > 0 ? Math.round((aktif / totalPegawai) * 100) : 0;
    const persenNonaktif = totalPegawai > 0 ? Math.round((nonaktif / totalPegawai) * 100) : 0;
    
    const wilayahStatistik = {};
    data.forEach(user => {
      const wilayah = user.wilayah_penugasan || 'Unknown';
      if (!wilayahStatistik[wilayah]) {
        wilayahStatistik[wilayah] = { total: 0, aktif: 0, nonaktif: 0 };
      }
      wilayahStatistik[wilayah].total++;
      if (user.is_active === true || user.is_active === 1) {
        wilayahStatistik[wilayah].aktif++;
      } else {
        wilayahStatistik[wilayah].nonaktif++;
      }
    });
    
    setStatistik({
      total_pegawai: totalPegawai,
      aktif: aktif,
      nonaktif: nonaktif,
      persen_aktif: persenAktif,
      persen_nonaktif: persenNonaktif,
      wilayah: wilayahStatistik,
      chart_data: {
        labels: ['Aktif', 'Nonaktif'],
        datasets: [{
          data: [aktif, nonaktif],
          backgroundColor: ['#10B981', '#EF4444'],
          borderColor: ['#0DA675', '#DC2626'],
          borderWidth: 1
        }]
      }
    });
  }, []);

  const loadUsersData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await aktifuserAPI.getAllUsers();
      
      let usersData = response.data?.data || response.data || [];
      
      const sortedData = sortUsersAlphabetically(usersData);
      setSortedUsers(sortedData);
      setUsersList(sortedData);
      calculateStatistik(sortedData);
      
    } catch (error) {
      console.error('Error loading users:', error);
      
      if (error.response?.status === 403) {
        setError('Akses ditolak. Anda tidak memiliki izin untuk mengakses data pegawai.');
        Swal.fire({
          icon: 'error',
          title: 'Akses Ditolak',
          text: 'Anda tidak memiliki izin untuk mengakses data pegawai.',
          confirmButtonColor: '#EF4444',
        });
      } else if (error.response?.status === 401) {
        setError('Sesi telah berakhir. Silakan login kembali.');
      } else {
        setError('Gagal memuat data pegawai: ' + (error.response?.data?.message || error.message));
      }
      
      setUsersList([]);
      setSortedUsers([]);
      setStatistik(getEmptyStatistik());
    } finally {
      setLoading(false);
    }
  }, [calculateStatistik, sortUsersAlphabetically]);

  useEffect(() => {
    loadUsersData();
  }, [loadUsersData]);

  const handleDeactivate = async (user) => {
    const result = await Swal.fire({
      title: 'Nonaktifkan Pegawai?',
      html: `Yakin ingin menonaktifkan <strong>${user.nama}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Nonaktifkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    });

    if (result.isConfirmed) {
      try {
        await aktifuserAPI.deactivateUser(user.id);
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pegawai berhasil dinonaktifkan',
          confirmButtonColor: '#10B981',
        });
        loadUsersData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response?.data?.message || 'Gagal menonaktifkan pegawai',
          confirmButtonColor: '#EF4444',
        });
      }
    }
  };

  const handleActivate = async (user) => {
    const result = await Swal.fire({
      title: 'Aktifkan Pegawai?',
      html: `Yakin ingin mengaktifkan <strong>${user.nama}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Aktifkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10B981',
    });

    if (result.isConfirmed) {
      try {
        await aktifuserAPI.activateUser(user.id);
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pegawai berhasil diaktifkan',
          confirmButtonColor: '#10B981',
        });
        loadUsersData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response?.data?.message || 'Gagal mengaktifkan pegawai',
          confirmButtonColor: '#EF4444',
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status, isActive) => {
    const statusConfig = {
      'Aktif': { 
        color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-200', 
        icon: '✅',
        textColor: 'text-emerald-700'
      },
      'Nonaktif': { 
        color: 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-800 border border-rose-200',
        icon: '❌',
        textColor: 'text-rose-700'
      },
    };
    
    const config = statusConfig[status] || {
      color: 'bg-gradient-to-r from-gray-100 to-slate-100 text-slate-800 border border-slate-200',
      icon: '👤',
      textColor: 'text-slate-700'
    };
    
    return {
      element: (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          <span>{config.icon}</span>
          <span className={config.textColor}>{status}</span>
        </span>
      ),
      config
    };
  };

  const getAktivasiBadge = (isActive) => {
    return isActive 
      ? {
          element: (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-200">
              <span>✅</span>
              <span className="text-emerald-700">Aktif</span>
            </span>
          ),
          isActive: true
        }
      : {
          element: (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-rose-100 text-rose-800 border border-rose-200">
              <span>🚫</span>
              <span className="text-rose-700">Nonaktif</span>
            </span>
          ),
          isActive: false
        };
  };

  return {
    usersList,
    sortedUsers,
    statistik,
    loading,
    error,
    loadUsersData,
    handleActivate,
    handleDeactivate,
    formatDate,
    formatDateTime,
    getStatusBadge,
    getAktivasiBadge
  };
}