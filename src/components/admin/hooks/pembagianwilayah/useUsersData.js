"use client";

import { useState, useEffect, useCallback } from 'react'; // PASTIKAN useEffect DIIMPOR
import { wilayahAPI } from '@/lib/api';
import Swal from "sweetalert2";

export function useUsersData() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentData, setAssignmentData] = useState({ wilayah_id: '' });

  const loadUsersData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await wilayahAPI.getAllPegawai();
      setUsersList(response.data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsersData();
  }, [loadUsersData]);

  const handleAssignClick = (user, setSelectedUser, setAssignmentData, setShowAssignModal) => {
    setSelectedUser(user);
    setAssignmentData({ wilayah_id: user.wilayah_id || '' });
    setShowAssignModal(true);
  };

  const handleAssign = async (e, selectedUser, assignmentData, onSuccess) => {
    e.preventDefault();
    try {
      if (!assignmentData.wilayah_id) {
        Swal.fire({
          icon: "warning",
          title: "Peringatan",
          text: "Pilih wilayah untuk ditugaskan",
          confirmButtonColor: "#F59E0B",
        });
        return false;
      }

      await wilayahAPI.assignToUser(selectedUser.id, assignmentData);
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Wilayah berhasil ditugaskan ke user",
        confirmButtonColor: "#10B981",
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Error assigning wilayah:', error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.response?.data?.message || 'Gagal menugaskan wilayah',
        confirmButtonColor: "#EF4444",
      });
      return false;
    }
  };

  const handleRemoveAssignment = async (user, onSuccess) => {
    Swal.fire({
      title: 'Hapus Penugasan Wilayah?',
      text: `Yakin ingin menghapus penugasan wilayah dari ${user.nama}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await wilayahAPI.assignToUser(user.id, { wilayah_id: null });
          
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Penugasan wilayah berhasil dihapus',
            confirmButtonColor: '#10B981',
          });
          
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error('Error removing assignment:', error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: error.response?.data?.message || 'Gagal menghapus penugasan',
            confirmButtonColor: '#EF4444',
          });
        }
      }
    });
  };

  const resetAssignmentForm = (setAssignmentData) => {
    setAssignmentData({ wilayah_id: '' });
  };

  return {
    usersList,
    loading,
    assignmentData,
    setAssignmentData,
    loadUsersData,
    handleAssignClick,
    handleAssign,
    handleRemoveAssignment,
    resetAssignmentForm
  };
}