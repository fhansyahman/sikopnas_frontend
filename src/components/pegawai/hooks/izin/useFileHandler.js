"use client";

import { useCallback } from "react";

export function useFileHandler() {
  const handleViewDocument = useCallback((dokumenPendukung) => {
    if (!dokumenPendukung) {
      alert('Tidak ada dokumen pendukung');
      return;
    }

    try {
      if (!dokumenPendukung.startsWith('data:') && !dokumenPendukung.startsWith('http')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const fileUrl = `${apiUrl}/uploads/izin/${dokumenPendukung}`;
        window.open(fileUrl, '_blank');
        return;
      }

      if (dokumenPendukung.startsWith('data:')) {
        if (dokumenPendukung.includes('application/pdf')) {
          const pdfWindow = window.open();
          if (pdfWindow) {
            pdfWindow.document.write(`
              <html>
                <head>
                  <title>Dokumen Pendukung</title>
                  <style>
                    body, html { margin: 0; padding: 0; height: 100%; }
                    embed { width: 100%; height: 100%; border: none; }
                  </style>
                </head>
                <body>
                  <embed src="${dokumenPendukung}" type="application/pdf" />
                </body>
              </html>
            `);
          }
        } else {
          const link = document.createElement('a');
          link.href = dokumenPendukung;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        window.open(dokumenPendukung, '_blank');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Gagal membuka dokumen');
    }
  }, []);

  const getFileName = useCallback((dokumenPendukung) => {
    if (!dokumenPendukung) return 'Dokumen';
    
    if (typeof dokumenPendukung === 'string') {
      if (dokumenPendukung.startsWith('data:')) {
        if (dokumenPendukung.includes('application/pdf')) return 'Dokumen.pdf';
        if (dokumenPendukung.includes('image/jpeg')) return 'Dokumen.jpg';
        if (dokumenPendukung.includes('image/png')) return 'Dokumen.png';
      }
      
      if (dokumenPendukung.includes('.') && !dokumenPendukung.includes('/') && !dokumenPendukung.includes('data:')) {
        return dokumenPendukung;
      }
    }
    
    return 'Dokumen Pendukung';
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    handleViewDocument,
    getFileName,
    formatFileSize
  };
}