"use client";

import { useState } from "react";
import { User, Calendar, Eye, Download, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useFileHandler } from "../../hooks/izin/useFileHandler";
import { izinAPI } from "@/lib/api";

export function IzinCard({ izin, userInfo, onEdit, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const { handleViewDocument, getFileName } = useFileHandler();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const getJenisDisplay = (jenis) => {
    const map = {
      'Sakit': 'Sakit',
      'Izin': 'Izin',
      'Dinas Luar': 'Dinas Luar'
    };
    return map[jenis] || jenis || 'Izin';
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus pengajuan izin ini?")) return;
    
    try {
      setLoading(true);
      const response = await izinAPI.delete(izin.id);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete izin');
      }
      
      alert('Izin berhasil dihapus');
      onRefresh();
    } catch (error) {
      console.error('Error deleting izin:', error);
      alert(error.response?.data?.message || error.message || 'Gagal menghapus izin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">
                {getJenisDisplay(izin.jenis)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <StatusBadge status={izin.status || 'Pending'} />
            {izin.Disetujui_by_name && izin.status === 'Disetujui' && (
              <span className="text-xs text-gray-500">
                Oleh: {izin.Disetujui_by_name}
              </span>
            )}
          </div>
        </div>

        {/* Periode */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-3">Periode Izin:</div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Mulai</div>
                <div className="font-semibold text-gray-800">
                  {formatDate(izin.tanggal_mulai)}
                </div>
              </div>
              <div className="flex-1 px-4">
                <div className="h-px bg-gray-300"></div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Selesai</div>
                <div className="font-semibold text-gray-800">
                  {formatDate(izin.tanggal_selesai)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keterangan */}
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">Keterangan:</div>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
            {izin.keterangan || "Tidak ada keterangan yang dicantumkan"}
          </p>
        </div>
        
        {/* Dokumen */}
        {izin.dokumen_pendukung && (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">Dokumen Pendukung:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleViewDocument(izin.dokumen_pendukung)}
                className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors duration-200"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat</span>
              </button>
              <button
                onClick={() => handleViewDocument(izin.dokumen_pendukung)}
                className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-100 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Calendar className="w-4 h-4" />
            <span>Durasi: <strong>{izin.durasi_hari || '1'} hari</strong></span>
          </div>
          <div className="text-sm text-gray-500">
            Diajukan: {formatDate(izin.created_at)}
          </div>
        </div>
        
        {/* Actions */}
        {izin.status === "Pending" && (
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            <button
              onClick={onEdit}
              disabled={loading}
              className="flex-1 flex items-center justify-center text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200 px-4 py-2.5 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 flex items-center justify-center text-red-600 text-sm hover:text-red-700 transition-colors duration-200 px-4 py-2.5 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}