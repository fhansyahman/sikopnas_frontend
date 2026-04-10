"use client";

import { useCallback } from "react";

export function useFileHandler() {
  // MODIFIKASI: Khusus untuk menangani PDF
  const handleViewDocument = useCallback((dokumenPendukung) => {
    if (!dokumenPendukung) {
      alert('Tidak ada dokumen pendukung');
      return;
    }

    try {
      // Handle file dari server (path)
      if (!dokumenPendukung.startsWith('data:') && !dokumenPendukung.startsWith('http')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const fileUrl = `${apiUrl}/uploads/izin/${dokumenPendukung}`;
        window.open(fileUrl, '_blank');
        return;
      }

      // Handle base64 data
      if (dokumenPendukung.startsWith('data:')) {
        // Pastikan file adalah PDF
        if (!dokumenPendukung.includes('application/pdf')) {
          alert('Hanya file PDF yang didukung untuk dilihat');
          return;
        }

        // Buka PDF di tab baru
        const pdfWindow = window.open();
        if (pdfWindow) {
          pdfWindow.document.write(`
            <html>
              <head>
                <title>Dokumen Pendukung PDF</title>
                <style>
                  body, html { margin: 0; padding: 0; height: 100%; }
                  embed { width: 100%; height: 100%; border: none; }
                </style>
              </head>
              <body>
                <embed src="${dokumenPendukung}" type="application/pdf" width="100%" height="100%" />
                <div style="position: fixed; bottom: 10px; right: 10px; background: #f0f0f0; padding: 5px 10px; border-radius: 5px; font-size: 12px;">
                  <a href="${dokumenPendukung}" download="dokumen.pdf" style="text-decoration: none; color: #007bff;">Download PDF</a>
                </div>
              </body>
            </html>
          `);
          pdfWindow.document.close();
        } else {
          alert('Pop-up blocker mungkin menghalangi. Izinkan pop-up untuk melihat dokumen.');
        }
      } else {
        window.open(dokumenPendukung, '_blank');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Gagal membuka dokumen PDF');
    }
  }, []);

  // MODIFIKASI: Nama file default untuk PDF
  const getFileName = useCallback((dokumenPendukung) => {
    if (!dokumenPendukung) return 'Dokumen.pdf';
    
    if (typeof dokumenPendukung === 'string') {
      if (dokumenPendukung.startsWith('data:')) {
        if (dokumenPendukung.includes('application/pdf')) return 'Dokumen.pdf';
      }
      
      if (dokumenPendukung.includes('.') && !dokumenPendukung.includes('/') && !dokumenPendukung.includes('data:')) {
        return dokumenPendukung;
      }
      
      // Cek apakah string mengandung ekstensi .pdf
      if (dokumenPendukung.toLowerCase().endsWith('.pdf')) {
        return dokumenPendukung;
      }
    }
    
    return 'Dokumen_Pendukung.pdf';
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Fungsi tambahan untuk download PDF
  const downloadPDF = useCallback((dokumenPendukung, filename = 'dokumen.pdf') => {
    if (!dokumenPendukung) {
      alert('Tidak ada dokumen untuk diunduh');
      return;
    }

    try {
      let downloadUrl = dokumenPendukung;
      
      if (dokumenPendukung.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = dokumenPendukung;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (!dokumenPendukung.startsWith('http')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const fileUrl = `${apiUrl}/uploads/izin/${dokumenPendukung}`;
        window.open(fileUrl, '_blank');
      } else {
        window.open(dokumenPendukung, '_blank');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Gagal mengunduh dokumen PDF');
    }
  }, []);

  return {
    handleViewDocument,
    getFileName,
    formatFileSize,
    downloadPDF // Ekspor fungsi baru
  };
}