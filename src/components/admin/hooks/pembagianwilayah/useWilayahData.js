"use client";

import { useState, useEffect, useCallback } from 'react'; // PASTIKAN useEffect DIIMPOR
import { wilayahAPI } from '@/lib/api';
import Swal from "sweetalert2";

export function useWilayahData() {
  const [wilayahList, setWilayahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ 
    nama_wilayah: '', 
    keterangan: '' 
  });

  const loadWilayahData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wilayahAPI.getAll();
      setWilayahList(response.data.data || []);
    } catch (error) {
      console.error('Error loading wilayah:', error);
      setError('Gagal memuat data wilayah');
      setWilayahList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWilayahData();
  }, [loadWilayahData]);

  const handleSubmit = async (e, formData, isEdit, selectedWilayah, onSuccess) => {
    e.preventDefault();
    try {
      if (!formData.nama_wilayah) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "Nama wilayah wajib diisi",
          confirmButtonColor: "#F59E0B",
        });
        return false;
      }

      if (isEdit && selectedWilayah) {
        await wilayahAPI.update(selectedWilayah.id, formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data wilayah berhasil diupdate",
          confirmButtonColor: "#10B981",
        });
      } else {
        await wilayahAPI.create(formData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data wilayah berhasil dibuat",
          confirmButtonColor: "#10B981",
        });
      }

      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Error saving wilayah:', error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.response?.data?.message || 'Gagal menyimpan data wilayah',
        confirmButtonColor: "#EF4444",
      });
      return false;
    }
  };

  const handleEdit = (wilayah, setFormData, setIsEdit, setSelectedWilayah, setShowFormModal) => {
    setSelectedWilayah(wilayah);
    setFormData({
      nama_wilayah: wilayah.nama_wilayah,
      keterangan: wilayah.keterangan || ''
    });
    setIsEdit(true);
    setShowFormModal(true);
  };

  const handleDelete = async (id, nama_wilayah, onSuccess) => {
    Swal.fire({
      title: 'Hapus Wilayah?',
      text: `Yakin ingin menghapus wilayah "${nama_wilayah}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await wilayahAPI.delete(id);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Wilayah berhasil dihapus',
            confirmButtonColor: '#10B981',
          });
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error('Error deleting wilayah:', error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.response?.data?.message || 'Gagal menghapus wilayah',
            confirmButtonColor: '#EF4444',
          });
        }
      }
    });
  };

  const handleViewUsers = async (wilayah, setSelectedWilayah, setShowUsersModal) => {
    setSelectedWilayah(wilayah);
    try {
      const response = await wilayahAPI.getUsersByWilayah(wilayah.id);
      setSelectedWilayah({
        ...wilayah,
        users: response.data.data || []
      });
      setShowUsersModal(true);
    } catch (error) {
      console.error('Error loading users by wilayah:', error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: 'Gagal memuat data users',
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const resetForm = (setFormData) => {
    setFormData({ nama_wilayah: '', keterangan: '' });
  };

  return {
    wilayahList,
    loading,
    error,
    formData,
    setFormData,
    loadWilayahData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleViewUsers,
    resetForm
  };
}