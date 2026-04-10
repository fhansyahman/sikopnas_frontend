"use client";

import { useState, useEffect, useCallback } from "react";
import { usersAPI } from "@/lib/api";
import Swal from "sweetalert2";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    password: '',
    no_hp: '',
    jabatan: '',
    roles: 'pegawai',
    status: 'Aktif',
    is_active: true,
    wilayah_penugasan: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    jenis_kelamin: '',
    pendidikan_terakhir: '',
    telegram_id: '',
    jam_kerja_id: '',
    can_remote: false,
    foto: ''
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAll();
      
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      } else {
        usersData = [];
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const resetForm = useCallback(() => {
    setFormData({
      nama: '',
      username: '',
      password: '',
      no_hp: '',
      jabatan: '',
      roles: 'pegawai',
      status: 'Aktif',
      is_active: true,
      wilayah_penugasan: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      alamat: '',
      jenis_kelamin: '',
      pendidikan_terakhir: '',
      telegram_id: '',
      jam_kerja_id: '',
      can_remote: false,
      foto: ''
    });
    setEditingUser(null);
  }, []);

  const handleShowEditModal = useCallback((user) => {
    setFormData({
      nama: user.nama || '',
      username: user.username || '',
      password: '',
      no_hp: user.no_hp || '',
      jabatan: user.jabatan || '',
      roles: user.roles || 'pegawai',
      status: user.status || 'Aktif',
      is_active: user.is_active !== undefined ? user.is_active : true,
      wilayah_penugasan: user.wilayah_penugasan || '',
      tempat_lahir: user.tempat_lahir || '',
      tanggal_lahir: user.tanggal_lahir || '',
      alamat: user.alamat || '',
      jenis_kelamin: user.jenis_kelamin || '',
      pendidikan_terakhir: user.pendidikan_terakhir || '',
      telegram_id: user.telegram_id || '',
      jam_kerja_id: user.jam_kerja_id || '',
      can_remote: user.can_remote || false,
      foto: user.foto || ''
    });
    setEditingUser(user);
    setShowModal(true);
  }, []);

  const handleShowPasswordModal = useCallback((user) => {
    setSelectedUser(user);
    setPasswordData({ password: '', confirmPassword: '' });
    setShowPasswordModal(true);
  }, []);

  const handleViewDetail = useCallback((user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.nama || !formData.username || !formData.jabatan) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Lengkap",
          text: "Nama, Username, dan Jabatan wajib diisi",
          confirmButtonColor: "#EF4444",
        });
        return;
      }
      
      if (!editingUser && !formData.password) {
        Swal.fire({
          icon: "error",
          title: "Password Wajib",
          text: "Password wajib diisi untuk pengguna baru",
          confirmButtonColor: "#EF4444",
        });
        return;
      }

      const userData = { 
        ...formData,
        can_remote: formData.can_remote ? 1 : 0,
        is_active: formData.is_active ? 1 : 0
      };
      
      if (editingUser && !userData.password) {
        delete userData.password;
      }

      if (editingUser) {
        await usersAPI.update(editingUser.id, userData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data pengguna berhasil diperbarui",
          confirmButtonColor: "#10B981",
        });
      } else {
        await usersAPI.create(userData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pengguna baru berhasil ditambahkan",
          confirmButtonColor: "#10B981",
        });
      }
      
      setShowModal(false);
      await loadUsers();
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.response?.data?.message || error.message || 'Terjadi kesalahan',
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleDelete = useCallback((user) => {
    setUserToDelete(user);
    setShowConfirmDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!userToDelete) return;
    
    try {
      await usersAPI.delete(userToDelete.id);
      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Data pengguna berhasil dihapus",
        confirmButtonColor: "#10B981",
        timer: 1500,
        showConfirmButton: false
      });
      await loadUsers();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: 'Tidak dapat menghapus pengguna',
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setShowConfirmDialog(false);
      setUserToDelete(null);
    }
  }, [userToDelete, loadUsers]);

  // 🔥 PERBAIKAN: Handle Password Change dengan Debug
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!passwordData.password || !passwordData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Kosong",
        text: "Password dan konfirmasi password harus diisi",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Tidak Cocok",
        text: "Password dan konfirmasi password harus sama",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    if (passwordData.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Password Terlalu Pendek",
        text: "Password minimal 6 karakter",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    if (!selectedUser?.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Data pengguna tidak ditemukan",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    // Tampilkan loading
    Swal.fire({
      title: "Memproses...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      console.log("🔄 Mencoba update password untuk user ID:", selectedUser.id);
      console.log("📤 Data yang dikirim:", { password: passwordData.password });
      console.log("🔗 Endpoint yang dipanggil:", `/users/${selectedUser.id}/password`);
      
      // Panggil API
      const response = await usersAPI.updatePassword(selectedUser.id, passwordData.password);
      
      console.log("✅ Response sukses:", response);
      
      Swal.close();
      
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Password untuk ${selectedUser.nama} berhasil diperbarui`,
        confirmButtonColor: "#10B981",
        timer: 2000
      });
      
      setShowPasswordModal(false);
      setPasswordData({ password: '', confirmPassword: '' });
      
    } catch (error) {
      console.error("❌ Error detail:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        fullUrl: error.config?.baseURL + error.config?.url
      });
      
      Swal.close();
      
      // Handle 404 - Route not found
      if (error.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Endpoint Tidak Ditemukan (404)",
          html: `
            <div class="text-left">
              <p class="mb-2">Endpoint <code class="bg-gray-100 px-2 py-1 rounded">/users/${selectedUser.id}/password</code> tidak ditemukan di server.</p>
              <p class="mb-2 text-sm font-semibold">Kemungkinan penyebab:</p>
              <ul class="list-disc list-inside text-sm text-gray-600 mb-3">
                <li>Route di backend berbeda (misal: /api/users/...)</li>
                <li>Method HTTP salah (bukan PATCH)</li>
                <li>Server belum memiliki route untuk update password</li>
              </ul>
              <p class="text-sm">Cek console browser untuk detail lengkap.</p>
            </div>
          `,
          confirmButtonText: "Mengerti",
          confirmButtonColor: "#3B82F6",
        });
      } 
      // Handle 400 - Bad request
      else if (error.response?.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid (400)",
          text: error.response?.data?.message || "Format data yang dikirim salah",
          confirmButtonColor: "#EF4444",
        });
      }
      // Handle 401/403 - Unauthorized
      else if (error.response?.status === 401 || error.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Tidak Diizinkan",
          text: "Anda tidak memiliki izin untuk mengubah password",
          confirmButtonColor: "#EF4444",
        });
      }
      // Handle lainnya
      else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: error.response?.data?.message || error.message || 'Terjadi kesalahan',
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: "error",
        title: "File Tidak Valid",
        text: "Hanya file gambar yang diperbolehkan",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Terlalu Besar",
        text: "Ukuran maksimal file adalah 2MB",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, foto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return {
    users,
    loading,
    error,
    selectedUser,
    showModal,
    showDetailModal,
    showPasswordModal,
    showConfirmDialog,
    userToDelete,
    editingUser,
    formData,
    passwordData,
    setShowModal,
    setShowDetailModal,
    setShowPasswordModal,
    setShowConfirmDialog,
    setUserToDelete,
    setSelectedUser,
    setFormData,
    setPasswordData,
    loadUsers,
    handleSubmit,
    handleDelete,
    confirmDelete,
    handlePasswordChange,
    handleShowEditModal,
    handleShowPasswordModal,
    handleViewDetail,
    handleFileChange,
    resetForm
  };
}