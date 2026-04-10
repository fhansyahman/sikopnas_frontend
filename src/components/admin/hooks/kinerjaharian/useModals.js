"use client";

import { useState, useCallback } from "react";
import Swal from "sweetalert2";

export function useModals() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedKinerja, setSelectedKinerja] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    ruas_jalan: '',
    kegiatan: '',
    panjang_kr: '',
    panjang_kn: '',
    warna_sket: { warna1: '', warna2: '', warna3: '' },
    sket_image: '',
    foto_0: '',
    foto_50: '',
    foto_100: ''
  });

  const openDetailModal = useCallback((kinerja) => {
    setSelectedKinerja(kinerja);
    setShowDetailModal(true);
  }, []);

  const openEditModal = useCallback((kinerja) => {
    setSelectedKinerja(kinerja);
    setFormData({
      ruas_jalan: kinerja.ruas_jalan,
      kegiatan: kinerja.kegiatan,
      panjang_kr: kinerja.panjang_kr,
      panjang_kn: kinerja.panjang_kn,
      warna_sket: kinerja.warna_sket || { warna1: '', warna2: '', warna3: '' },
      sket_image: kinerja.sket_image || '',
      foto_0: kinerja.foto_0 || '',
      foto_50: kinerja.foto_50 || '',
      foto_100: kinerja.foto_100 || ''
    });
    setShowEditModal(true);
  }, []);

  const openDownloadModal = useCallback((kinerja) => {
    setSelectedKinerja(kinerja);
    setShowDownloadModal(true);
  }, []);

  const openImageViewer = useCallback((imageUrl, images, index = 0) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
    setShowImageViewer(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedKinerja(null);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedKinerja(null);
  }, []);

  const closeDownloadModal = useCallback(() => {
    setShowDownloadModal(false);
    setSelectedKinerja(null);
  }, []);

  const closeImageViewer = useCallback(() => {
    setShowImageViewer(false);
    setSelectedImage(null);
  }, []);

  const navigateImage = useCallback((direction, imageList) => {
    if (direction === 'next') {
      const nextIndex = (currentImageIndex + 1) % imageList.length;
      setSelectedImage(imageList[nextIndex]);
      setCurrentImageIndex(nextIndex);
    } else {
      const prevIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
      setSelectedImage(imageList[prevIndex]);
      setCurrentImageIndex(prevIndex);
    }
  }, [currentImageIndex]);

  const downloadImage = useCallback(async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `foto-kinerja-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Gambar berhasil didownload',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#10B981',
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal mendownload gambar',
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#EF4444',
      });
    }
  }, []);

  const getImageList = useCallback((kinerja) => {
    const images = [];
    if (kinerja?.sket_image) images.push(kinerja.sket_image);
    if (kinerja?.foto_0) images.push(kinerja.foto_0);
    if (kinerja?.foto_50) images.push(kinerja.foto_50);
    if (kinerja?.foto_100) images.push(kinerja.foto_100);
    return images;
  }, []);

  return {
    showDetailModal,
    showEditModal,
    showDownloadModal,
    showImageViewer,
    selectedKinerja,
    selectedImage,
    currentImageIndex,
    formData,
    setFormData,
    openDetailModal,
    openEditModal,
    openDownloadModal,
    openImageViewer,
    closeDetailModal,
    closeEditModal,
    closeDownloadModal,
    closeImageViewer,
    navigateImage,
    downloadImage,
    getImageList
  };
}