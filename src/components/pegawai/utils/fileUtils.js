export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function handleViewDocument(dokumenPendukung) {
  if (!dokumenPendukung) {
    alert('Tidak ada dokumen pendukung');
    return;
  }

  try {
    // Jika dokumen adalah nama file (string tanpa data: prefix)
    if (!dokumenPendukung.startsWith('data:') && !dokumenPendukung.startsWith('http')) {
      const fileUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/uploads/izin/${dokumenPendukung}`;
      window.open(fileUrl, '_blank');
      return;
    }

    // Cek jika dokumen adalah base64
    if (dokumenPendukung.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = dokumenPendukung;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      if (dokumenPendukung.includes('application/pdf')) {
        link.download = 'dokumen-pendukung.pdf';
      } else if (dokumenPendukung.includes('image/jpeg')) {
        link.download = 'dokumen-pendukung.jpg';
      } else if (dokumenPendukung.includes('image/png')) {
        link.download = 'dokumen-pendukung.png';
      } else {
        link.download = 'dokumen-pendukung';
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // URL biasa
      window.open(dokumenPendukung, '_blank');
    }
  } catch (error) {
    console.error('Error viewing document:', error);
    alert('Gagal membuka dokumen');
  }
}

export function getFileName(dokumenPendukung) {
  if (!dokumenPendukung) return 'Dokumen';
  
  if (dokumenPendukung.startsWith('data:')) {
    if (dokumenPendukung.includes('application/pdf')) {
      return 'Dokumen.pdf';
    } else if (dokumenPendukung.includes('image/jpeg')) {
      return 'Dokumen.jpg';
    } else if (dokumenPendukung.includes('image/png')) {
      return 'Dokumen.png';
    }
  }
  
  // Jika hanya nama file tanpa path
  if (dokumenPendukung.includes('.') && !dokumenPendukung.includes('/')) {
    return dokumenPendukung;
  }
  
  return 'Lihat Dokumen';
}