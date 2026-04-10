"use client";

import { X, Calendar, FileText, Download, Check } from "lucide-react";
import { StatusBadge, JenisBadge } from "./Badges";

export function DetailModal({ isOpen, onClose, izin, onUpdateStatus }) {
  if (!isOpen || !izin) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Pengajuan Izin</h2>
            <p className="text-sm text-blue-600">{izin.nama_pegawai}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="space-y-4">
                <InfoItem 
                  label="Tanggal Pengajuan" 
                  value={formatDateTime(izin.created_at)}
                  size="lg"
                />
                <InfoItem label="Pegawai" value={izin.nama_pegawai}>
                  <p className="text-sm text-gray-600">{izin.jabatan}</p>
                  <p className="text-xs text-blue-600 mt-1">ID: {izin.id}</p>
                </InfoItem>
                <InfoItem label="Wilayah Penugasan" value={izin.wilayah_penugasan} />
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <StatusBadge status={izin.status} />
                </div>
              </div>
            </div>

            {/* Right Column - Periode Izin */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={18} />
                Periode Izin
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DateBox label="Mulai" date={izin.tanggal_mulai} formatDate={formatDate} />
                  <DateBox label="Selesai" date={izin.tanggal_selesai} formatDate={formatDate} />
                </div>
                <DurationBox days={izin.durasi_hari} />
              </div>
            </div>
          </div>

          {/* Jenis dan Keterangan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-3">Jenis Izin</h4>
              <JenisBadge jenis={izin.jenis} />
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="font-semibold text-gray-900 mb-3">Keterangan</h4>
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-gray-700 text-sm">
                  {izin.keterangan || 'Tidak ada keterangan tambahan'}
                </p>
              </div>
            </div>
          </div>

          {/* Dokumen Pendukung */}
          {izin.dokumen_pendukung && (
            <div className="bg-gray-50 rounded-xl p-5 mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={18} />
                Dokumen Pendukung
              </h4>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                <Download size={16} />
                Download Dokumen
              </button>
            </div>
          )}

          {/* Informasi Persetujuan */}
          {(izin.Disetujui_by_name || izin.updated_at !== izin.created_at) && (
            <div className="bg-gray-50 rounded-xl p-5 mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">Informasi Persetujuan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {izin.Disetujui_by_name && (
                  <InfoItem label="Disetujui Oleh" value={izin.Disetujui_by_name} />
                )}
                {izin.updated_at !== izin.created_at && (
                  <InfoItem label="Waktu Persetujuan" value={formatDateTime(izin.updated_at)} />
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Tutup
            </button>
            {izin.status === 'Pending' && (
              <>
                <button
                  onClick={() => onUpdateStatus(izin.id, 'Disetujui')}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
                >
                  <Check size={16} />
                  Setujui
                </button>
                <button
                  onClick={() => onUpdateStatus(izin.id, 'Ditolak')}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-rose-700 flex items-center gap-2"
                >
                  <X size={16} />
                  Tolak
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, children, size = "normal" }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      {value && <p className={`font-medium text-gray-900 ${size === 'lg' ? 'text-lg' : ''}`}>{value}</p>}
      {children}
    </div>
  );
}

function DateBox({ label, date, formatDate }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100">
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <p className="font-semibold text-gray-800">{formatDate(date)}</p>
    </div>
  );
}

function DurationBox({ days }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100">
      <label className="block text-xs text-gray-600 mb-1">Durasi</label>
      <p className="text-2xl font-bold text-gray-800">{days} hari</p>
    </div>
  );
}