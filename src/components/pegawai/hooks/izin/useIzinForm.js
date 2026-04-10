"use client";

import { useState, useEffect, useCallback } from "react";
import { izinAPI } from "@/lib/api";

export function useIzinForm(editData, onSuccess) {
  const [formData, setFormData] = useState({
    jenis: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    keterangan: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingDokumen, setExistingDokumen] = useState(null);
  const [loading, setLoading] = useState(false);

  const jenisIzinOptions = [
    'Sakit', 'Izin', 'Dinas Luar'
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        jenis: editData.jenis || '',
        tanggalMulai: formatDateForInput(editData.tanggal_mulai),
        tanggalSelesai: formatDateForInput(editData.tanggal_selesai),
        keterangan: editData.keterangan || '',
      });
      setExistingDokumen(editData.dokumen_pendukung || null);
    }
  }, [editData]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const adjustDateForServer = (dateString) => {
    return dateString; // Backend akan handle timezone
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileUpload = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal 5MB`);
        return false;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} harus PDF, JPG, atau PNG`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(validFiles.slice(0, 1));
    }
  }, []);

  const removeFile = useCallback((index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.jenis || !formData.tanggalMulai || !formData.tanggalSelesai) {
      alert("Jenis, tanggal mulai, dan tanggal selesai wajib diisi!");
      return;
    }

    if (new Date(formData.tanggalMulai) > new Date(formData.tanggalSelesai)) {
      alert("Tanggal selesai tidak boleh sebelum tanggal mulai!");
      return;
    }

    try {
      setLoading(true);
      
      let dokumenPendukungBase64 = null;
      if (uploadedFiles.length > 0) {
        dokumenPendukungBase64 = await fileToBase64(uploadedFiles[0]);
      }

      const izinData = {
        jenis: formData.jenis,
        tanggal_mulai: adjustDateForServer(formData.tanggalMulai),
        tanggal_selesai: adjustDateForServer(formData.tanggalSelesai),
        keterangan: formData.keterangan || null,
        dokumen_pendukung: dokumenPendukungBase64
      };

      console.log('Submitting izin data:', izinData);

      let response;
      if (editData) {
        const deleteResponse = await izinAPI.delete(editData.id);
        if (!deleteResponse.data.success) {
          throw new Error(deleteResponse.data.message || 'Gagal menghapus izin lama');
        }
        response = await izinAPI.create(izinData);
      } else {
        response = await izinAPI.create(izinData);
      }

      console.log('API Response:', response);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Operation failed');
      }
      
      alert(editData ? "Data izin berhasil diperbarui!" : "Pengajuan izin berhasil dikirim!");
      onSuccess?.();
      
    } catch (error) {
      console.error('Error submitting izin:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Gagal mengajukan izin. Periksa koneksi Anda.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    uploadedFiles,
    existingDokumen,
    loading,
    jenisIzinOptions,
    handleChange,
    handleFileUpload,
    removeFile,
    handleSubmit
  };
}