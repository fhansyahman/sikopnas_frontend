"use client";

import { useState, useEffect } from "react";

export function useFormJamKerja(editingJamKerja, onSubmit, onClose) {
  const [formData, setFormData] = useState({
    nama_setting: '',
    jam_masuk_standar: '08:00',
    jam_pulang_standar: '17:00',
    toleransi_keterlambatan: '00:15',
    batas_terlambat: '09:00',
    is_active: false
  });

  useEffect(() => {
    if (editingJamKerja) {
      setFormData({
        nama_setting: editingJamKerja.nama_setting || '',
        jam_masuk_standar: editingJamKerja.jam_masuk_standar?.substring(0, 5) || '08:00',
        jam_pulang_standar: editingJamKerja.jam_pulang_standar?.substring(0, 5) || '17:00',
        toleransi_keterlambatan: editingJamKerja.toleransi_keterlambatan?.substring(0, 5) || '00:15',
        batas_terlambat: editingJamKerja.batas_terlambat?.substring(0, 5) || '09:00',
        is_active: editingJamKerja.is_active || false
      });
    } else {
      setFormData({
        nama_setting: '',
        jam_masuk_standar: '08:00',
        jam_pulang_standar: '17:00',
        toleransi_keterlambatan: '00:15',
        batas_terlambat: '09:00',
        is_active: false
      });
    }
  }, [editingJamKerja]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    onClose();
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    handleClose
  };
}