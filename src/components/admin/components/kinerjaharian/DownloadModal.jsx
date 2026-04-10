"use client";

import { X, Download, FileText, Calendar, User, MapPin, Ruler } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { adminKinerjaAPI } from "@/lib/api";

export function DownloadModal({ isOpen, onClose, kinerja }) {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('pdf');

  if (!isOpen || !kinerja) return null;

  const handleDownload = async () => {
    setLoading(true);
    try {
      let response;
      
      if (format === 'pdf') {
        response = await adminKinerjaAPI.downloadPDF(kinerja.id);
      } else {
        response = await adminKinerjaAPI.downloadExcel(kinerja.id);
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-kinerja-${kinerja.nama}-${kinerja.tanggal}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Laporan berhasil didownload',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#10B981',
      });

      onClose();
    } catch (error) {
      console.error('Error downloading:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: error.response?.data?.message || 'Gagal mendownload laporan',
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Download Laporan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          {/* Info Ringkas */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <FileText size={16} />
              Informasi Laporan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <User size={14} />
                <span>{kinerja.nama}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <Calendar size={14} />
                <span>{new Date(kinerja.tanggal).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <MapPin size={14} />
                <span className="truncate">{kinerja.ruas_jalan}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <Ruler size={14} />
                <span>KR: {kinerja.panjang_kr}m | KN: {kinerja.panjang_kn}m</span>
              </div>
            </div>
          </div>

          {/* Pilih Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pilih Format File
            </label>
            <div className="grid grid-cols-2 gap-3">
              <FormatOption
                icon={<FileText size={20} />}
                label="PDF Document"
                format="pdf"
                selected={format === 'pdf'}
                onClick={() => setFormat('pdf')}
              />
              <FormatOption
                icon={<FileText size={20} />}
                label="Excel Spreadsheet"
                format="excel"
                selected={format === 'excel'}
                onClick={() => setFormat('excel')}
                disabled
              />
            </div>
            {format === 'excel' && (
              <p className="text-xs text-amber-600 mt-2">
                *Fitur Excel sedang dalam pengembangan
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleDownload}
              disabled={loading || format === 'excel'}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mendownload...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormatOption({ icon, label, format, selected, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 border rounded-lg transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className={selected ? 'text-blue-600' : 'text-gray-600'}>
          {icon}
        </div>
        <span className={`text-xs font-medium ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
          {label}
        </span>
      </div>
    </button>
  );
}