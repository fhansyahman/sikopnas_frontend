'use client';

import { useState } from 'react';
import Swal from "sweetalert2";

export function useDownloadHandler(kinerjaList, setShowDownloadModal, setSelectedDownloadType, setSelectedKinerjaForDownload) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);

  const handleShowDownloadPerorangan = (kinerja) => {
    setSelectedKinerjaForDownload(kinerja);
    setSelectedDownloadType('perorangan');
    setShowDownloadModal(true);
  };

  const handleShowDownloadRekap = () => {
    if (kinerjaList.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Ada Data',
        text: 'Tidak ada data kinerja untuk didownload',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#F59E0B',
      });
      return;
    }
    setSelectedDownloadType('rekap');
    setShowDownloadModal(true);
  };

  const handleDownloadAllPerorangan = async () => {
    if (kinerjaList.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Ada Data',
        text: 'Tidak ada data kinerja untuk didownload',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#F59E0B',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Download Semua Laporan Perorangan',
      text: `Akan mendownload ${kinerjaList.length} file PDF (masing-masing 2 halaman per pegawai). Proses ini mungkin memakan waktu.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ya, Download Semua',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
    });

    if (result.isConfirmed) {
      setIsGeneratingPDF(true);
      setGeneratingProgress(0);
      
      try {
        // Simulasi proses download
        for (let i = 0; i < kinerjaList.length; i++) {
          setGeneratingProgress(Math.round(((i + 1) / kinerjaList.length) * 100));
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `${kinerjaList.length} file PDF berhasil didownload`,
          confirmButtonText: 'Oke',
          confirmButtonColor: '#10B981',
        });
        
      } catch (error) {
        console.error('Error downloading all:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal mendownload semua laporan',
          confirmButtonText: 'Tutup',
          confirmButtonColor: '#EF4444',
        });
      } finally {
        setIsGeneratingPDF(false);
        setGeneratingProgress(0);
      }
    }
  };

  return {
    isGeneratingPDF,
    generatingProgress,
    handleDownloadAllPerorangan,
    handleShowDownloadRekap,
    handleShowDownloadPerorangan
  };
}