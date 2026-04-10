"use client";

import { X } from "lucide-react";

export function FotoModal({ isOpen, onClose, foto, presensi, formatTime }) {
  if (!isOpen || !foto) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="relative w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white z-10"
        >
          <X size={24} />
        </button>
        
        <div className="bg-black rounded-lg overflow-hidden">
          <FotoHeader 
            jenis={foto.jenis} 
            nama={presensi?.nama}
            waktu={foto.jenis === 'Masuk' ? presensi?.jam_masuk : presensi?.jam_pulang}
            formatTime={formatTime}
          />
          
          <FotoViewer src={foto.src} jenis={foto.jenis} />
          
          <FotoFooter src={foto.src} jenis={foto.jenis} presensi={presensi} />
        </div>
      </div>
    </div>
  );
}

function FotoHeader({ jenis, nama, waktu, formatTime }) {
  return (
    <div className="p-4 bg-black/50 border-b border-gray-800">
      <h3 className="text-white font-medium">
        Foto {jenis} - {nama}
      </h3>
      {waktu && (
        <p className="text-gray-400 text-sm">Waktu: {formatTime(waktu)}</p>
      )}
    </div>
  );
}

function FotoViewer({ src, jenis }) {
  return (
    <div className="relative">
      <img
        src={src}
        alt={`Foto ${jenis}`}
        className="w-full h-auto max-h-[70vh] object-contain"
        onError={(e) => {
          console.error('Gagal memuat foto besar:', src);
          e.target.parentElement.innerHTML = `
            <div class="flex items-center justify-center h-96">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <p class="text-gray-400">Foto tidak dapat dimuat</p>
                <p class="text-sm text-gray-500 mt-2">URL: ${src?.substring(0, 50)}...</p>
              </div>
            </div>
          `;
        }}
      />
    </div>
  );
}

function FotoFooter({ src, jenis, presensi }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `foto_${jenis.toLowerCase()}_${presensi?.nama}_${presensi?.tanggal}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 bg-black/50 border-t border-gray-800 flex justify-between items-center">
      <p className="text-gray-400 text-sm">
        Klik di luar gambar atau tekan ESC untuk menutup
      </p>
      <div className="flex gap-2">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
        >
          Buka di Tab Baru
        </a>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  );
}