// hooks/kinerja/useKinerjaForm.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { kinerjaAPI } from "@/lib/api";

export function useKinerjaForm(editData, onSuccess) {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    ruas_jalan: "",
    kegiatan: "",
    panjang_kr: "",
    panjang_kn: "",
    sket_image: "",
    foto_0: "",
    foto_50: "",
    foto_100: ""
  });
  const [preview, setPreview] = useState({
    foto_0: null,
    foto_50: null,
    foto_100: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Ref untuk melacak apakah form sudah diinisialisasi dengan data edit
  const initializedRef = useRef(false);
  // Ref untuk menyimpan ID editData sebelumnya
  const prevEditIdRef = useRef(null);

  const daftarKegiatan = [
    "Pemeliharaan Jalan",
    "Pembersihan Saluran",
    "Penghijauan",
    "Pengecatan Marka Jalan",
    "Perbaikan Fasilitas Jalan",
    "Pengawasan Proyek",
    "Lainnya"
  ];

  // Effect untuk mengisi form dengan data edit
  useEffect(() => {
    // Cek apakah ini editData baru (berbeda ID)
    const currentEditId = editData?.id || null;
    const isNewEditData = currentEditId !== prevEditIdRef.current;
    
    // Jika ada editData dan (belum diinisialisasi atau ini data edit yang berbeda)
    if (editData && (!initializedRef.current || isNewEditData)) {
      setForm({
        tanggal: editData.tanggal,
        ruas_jalan: editData.ruas_jalan,
        kegiatan: editData.kegiatan,
        panjang_kr: editData.panjang_kr?.toString().replace(' meter', '') || "",
        panjang_kn: editData.panjang_kn?.toString().replace(' meter', '') || "",
        sket_image: editData.sket_image || "",
        foto_0: editData.foto_0 || "",
        foto_50: editData.foto_50 || "",
        foto_100: editData.foto_100 || ""
      });
      
      setPreview({
        foto_0: editData.foto_0 || null,
        foto_50: editData.foto_50 || null,
        foto_100: editData.foto_100 || null,
      });
      
      // Tandai sudah diinisialisasi dan simpan ID
      initializedRef.current = true;
      prevEditIdRef.current = currentEditId;
    }
    
    // Reset tracking ketika pindah ke mode create (editData menjadi null)
    if (!editData) {
      initializedRef.current = false;
      prevEditIdRef.current = null;
      
      // Reset form ke default tapi pertahankan tanggal hari ini
      setForm(prev => ({
        ...prev,
        tanggal: new Date().toISOString().split('T')[0],
        ruas_jalan: "",
        kegiatan: "",
        panjang_kr: "",
        panjang_kn: "",
        sket_image: "",
        foto_0: "",
        foto_50: "",
        foto_100: ""
      }));
      
      setPreview({
        foto_0: null,
        foto_50: null,
        foto_100: null
      });
    }
  }, [editData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // hooks/kinerja/useKinerjaForm.js - Update handleFileChange function

const handleFileChange = useCallback((e, setSketImage) => {
  const { name } = e.target;
  
  // Cek apakah ini dari kamera (base64 data) atau dari file input
  if (e.target._base64Data) {
    // Ini dari kamera - langsung gunakan base64 data
    const base64Data = e.target._base64Data;
    
    setForm(prev => ({ ...prev, [name]: base64Data }));
    setPreview(prev => ({ ...prev, [name]: base64Data }));
    
    // Jika ini adalah sket_image, update canvas
    if (name === 'sket_image' && setSketImage) {
      setSketImage(base64Data);
    }
    
    return;
  }
  
  // Ini dari file input biasa
  const { files } = e.target;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result;
      
      setForm(prev => ({ ...prev, [name]: url }));
      setPreview(prev => ({ ...prev, [name]: url }));
      
      // Jika ini adalah sket_image, update canvas
      if (name === 'sket_image' && setSketImage) {
        setSketImage(url);
      }
    };
    reader.readAsDataURL(files[0]);
  }
}, []);

  const clearPhoto = useCallback((photoKey) => {
    setForm(prev => ({ ...prev, [photoKey]: "" }));
    setPreview(prev => ({ ...prev, [photoKey]: null }));

    const fileInput = document.getElementById(photoKey);
    if (fileInput) {
      fileInput.value = '';
    }
  }, []);

  const resetForm = useCallback(() => {
    setForm({
      tanggal: new Date().toISOString().split('T')[0],
      ruas_jalan: "",
      kegiatan: "",
      panjang_kr: "",
      panjang_kn: "",
      sket_image: "",
      foto_0: "",
      foto_50: "",
      foto_100: ""
    });
    setPreview({ 
      foto_0: null, 
      foto_50: null, 
      foto_100: null 
    });
    setError("");
    
    // Reset tracking
    initializedRef.current = false;
    prevEditIdRef.current = null;

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });
  }, []);

  // Helper function to check if image is from camera (base64)
  const isBase64Image = (str) => {
    if (!str || typeof str !== 'string') return false;
    return str.startsWith('data:image/') && str.includes(';base64,');
  };

  const handleSubmit = async (e, sketImage) => {
    e.preventDefault();
    setError("");

    if (!form.tanggal || !form.ruas_jalan || !form.kegiatan) {
      setError("Harap isi semua field yang wajib!");
      return false;
    }

    if (form.panjang_kr && isNaN(form.panjang_kr)) {
      setError("Panjang KR harus berupa angka!");
      return false;
    }

    if (form.panjang_kn && isNaN(form.panjang_kn)) {
      setError("Panjang KN harus berupa angka!");
      return false;
    }

    try {
      setLoading(true);
      
      const requestBody = {
        tanggal: form.tanggal,
        ruas_jalan: form.ruas_jalan,
        kegiatan: form.kegiatan,
        panjang_kr: form.panjang_kr ? parseFloat(form.panjang_kr) : 0,
        panjang_kn: form.panjang_kn ? parseFloat(form.panjang_kn) : 0,
        sket_image: sketImage || form.sket_image || null,
        foto_0: form.foto_0 || null,
        foto_50: form.foto_50 || null,
        foto_100: form.foto_100 || null
      };

      let response;
      
      if (editData) {
        // Update - always use update endpoint
        response = await kinerjaAPI.update(editData.id, requestBody);
      } else {
        // Create - auto-detect if images are from camera (base64) or file upload
        const hasCameraImages = 
          (requestBody.foto_0 && isBase64Image(requestBody.foto_0)) ||
          (requestBody.foto_50 && isBase64Image(requestBody.foto_50)) ||
          (requestBody.foto_100 && isBase64Image(requestBody.foto_100)) ||
          (requestBody.sket_image && isBase64Image(requestBody.sket_image));
        
        if (hasCameraImages) {
          // Use camera endpoint for base64 images
          response = await kinerjaAPI.createWithCamera(requestBody);
        } else {
          // Use regular endpoint for file uploads
          response = await kinerjaAPI.create(requestBody);
        }
      }

      if (response.data.success) {
        const successMessage = editData ? "Data kinerja berhasil diperbarui!" : "Laporan kinerja berhasil disimpan!";
        alert(successMessage);
        resetForm();
        onSuccess?.();
        return true;
      } else {
        throw new Error(response.data.message || 'Gagal menyimpan data');
      }
      
    } catch (error) {
      let errorMessage = 'Gagal menyimpan laporan kinerja';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error: Terjadi masalah pada server. Silakan coba lagi.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    preview,
    loading,
    error,
    daftarKegiatan,
    handleChange,
    handleFileChange,
    clearPhoto,
    resetForm,
    handleSubmit
  };
}