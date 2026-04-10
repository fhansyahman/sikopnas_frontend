"use client";

import { X, Camera, Maximize2, FileCheck, Clock, MapPin, User, Calendar } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function DetailModal({ 
  isOpen, 
  onClose, 
  presensi, 
  onEdit, 
  onShowFoto,
  formatDate,
  formatTime,
  getStatusPresensi
}) {
  
  if (!isOpen || !presensi) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Presensi</h2>
            <p className="text-sm text-blue-600">{presensi.nama}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Informasi Utama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Info Kiri */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-500" />
                Informasi Pegawai
              </h3>
              <div className="space-y-4">
                <InfoItem 
                  icon={<Calendar className="w-4 h-4 text-gray-400" />}
                  label="Tanggal"
                  value={formatDate(presensi.tanggal)}
                />
                <InfoItem 
                  icon={<User className="w-4 h-4 text-gray-400" />}
                  label="Nama"
                  value={presensi.nama}
                  subValue={presensi.jabatan}
                />
                <InfoItem 
                  icon={<MapPin className="w-4 h-4 text-gray-400" />}
                  label="Wilayah Penugasan"
                  value={presensi.wilayah_penugasan}
                />
                <InfoItem 
                  icon={<FileCheck className="w-4 h-4 text-gray-400" />}
                  label="Status"
                  value={
                    <StatusBadge 
                      status={getStatusPresensi(presensi)} 
                      izinId={presensi.izin_id} 
                    />
                  }
                />
              </div>
            </div>

            {/* Info Kanan */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                Waktu Presensi
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem 
                    icon={<Clock className="w-4 h-4 text-gray-400" />}
                    label="Jam Masuk"
                    value={formatTime(presensi.jam_masuk)}
                    valueClass="text-lg font-semibold text-gray-900"
                  />
                  <InfoItem 
                    icon={<Clock className="w-4 h-4 text-gray-400" />}
                    label="Jam Pulang"
                    value={formatTime(presensi.jam_pulang)}
                    valueClass="text-lg font-semibold text-gray-900"
                  />
                </div>
                
                {presensi.status_masuk && presensi.status_masuk !== 'Tepat Waktu' && (
                  <InfoItem 
                    label="Status Masuk"
                    value={
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                        ${presensi.status_masuk === 'Terlambat' ? 'bg-amber-100 text-amber-800' : 
                          presensi.status_masuk === 'Izin' ? 'bg-purple-100 text-purple-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {presensi.status_masuk}
                      </span>
                    }
                  />
                )}
                
                {presensi.status_pulang && presensi.status_pulang !== 'Tepat Waktu' && (
                  <InfoItem 
                    label="Status Pulang"
                    value={
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                        ${presensi.status_pulang === 'Cepat Pulang' ? 'bg-orange-100 text-orange-800' : 
                          presensi.status_pulang === 'Belum Pulang' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {presensi.status_pulang}
                      </span>
                    }
                  />
                )}
                
                {presensi.is_lembur === 1 && (
                  <InfoItem 
                    label="Lembur"
                    value={presensi.jam_lembur}
                    valueClass="text-lg font-semibold text-indigo-600"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Bagian Foto */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera size={20} className="text-blue-500" />
              Bukti Foto Presensi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto Masuk */}
              <FotoCard
                title="Foto Masuk"
                waktu={presensi.jam_masuk}
                foto={presensi.foto_masuk}
                jenis="Masuk"
                onShowFoto={() => onShowFoto(presensi.foto_masuk, 'Masuk', presensi)}
                formatTime={formatTime}
              />
              
              {/* Foto Pulang */}
              <FotoCard
                title="Foto Pulang"
                waktu={presensi.jam_pulang}
                foto={presensi.foto_pulang}
                jenis="Pulang"
                onShowFoto={() => onShowFoto(presensi.foto_pulang, 'Pulang', presensi)}
                formatTime={formatTime}
              />
            </div>
          </div>

          {/* Informasi Izin */}
          {presensi.izin_id && (
            <div className="bg-purple-50 rounded-xl p-5 mb-6 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <FileCheck size={18} />
                Informasi Izin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-purple-600">ID Izin</p>
                  <p className="font-medium text-purple-900">{presensi.izin_id}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Jenis Izin</p>
                  <p className="font-medium text-purple-900">{presensi.jenis_izin || 'Tidak diketahui'}</p>
                </div>
              </div>
              {presensi.keterangan && (
                <div className="mt-4">
                  <p className="text-sm text-purple-600 mb-1">Keterangan</p>
                  <p className="text-purple-800 bg-white/50 p-3 rounded-lg">{presensi.keterangan}</p>
                </div>
              )}
            </div>
          )}

          {/* Keterangan Umum */}
          {presensi.keterangan && !presensi.izin_id && (
            <div className="bg-gray-50 rounded-xl p-5 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Keterangan</h3>
              <p className="text-gray-700">{presensi.keterangan}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Tutup
            </button>
            {!presensi.izin_id && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(presensi);
                }}
                className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 transition-colors"
              >
                Edit Data Presensi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component untuk Info Item
function InfoItem({ icon, label, value, subValue, valueClass = "text-gray-900" }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      {typeof value === 'string' ? (
        <>
          <p className={`${valueClass}`}>{value}</p>
          {subValue && <p className="text-sm text-gray-500 mt-0.5">{subValue}</p>}
        </>
      ) : (
        value
      )}
    </div>
  );
}

// Sub-component untuk Foto Card
function FotoCard({ title, waktu, foto, jenis, onShowFoto, formatTime }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500">
            Waktu: {formatTime(waktu) || '-'}
          </p>
        </div>
        {foto && (
          <button
            onClick={onShowFoto}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Lihat dalam ukuran penuh"
          >
            <Maximize2 size={18} />
          </button>
        )}
      </div>
      
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {foto ? (
          <img
            src={foto}
            alt={`Foto ${jenis}`}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onShowFoto}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia';
            }}
          />
        ) : (
          <div className="text-center p-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
              <Camera size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Tidak ada foto {jenis.toLowerCase()}</p>
          </div>
        )}
      </div>
      
      {foto && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Klik gambar untuk melihat dalam ukuran penuh
        </p>
      )}
    </div>
  );
}