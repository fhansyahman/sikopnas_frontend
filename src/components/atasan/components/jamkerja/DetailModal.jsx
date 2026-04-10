"use client";

import { X, Clock, CheckCircle, AlertCircle, Users, Calendar, Activity } from "lucide-react";

export function DetailModal({ showModal, onClose, selectedJamKerja, onEdit, formatTime, calculateTotalHours }) {
  if (!showModal || !selectedJamKerja) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Setting Jam Kerja</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Header Info */}
            <HeaderInfo 
              jamKerja={selectedJamKerja}
              formatTime={formatTime}
            />

            {/* Grid Informasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WaktuKerjaCard
                jamKerja={selectedJamKerja}
                formatTime={formatTime}
                calculateTotalHours={calculateTotalHours}
              />
              
              <ToleransiCard
                jamKerja={selectedJamKerja}
                formatTime={formatTime}
              />
            </div>

            {/* Informasi Tambahan */}
            <AdditionalInfo 
              jamKerja={selectedJamKerja}
              formatTime={formatTime}
            />
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(selectedJamKerja);
              }}
              className="px-5 py-2.5 bg-yellow-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700"
            >
              Edit Setting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderInfo({ jamKerja, formatTime }) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{jamKerja.nama_setting}</h3>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge isActive={jamKerja.is_active} />
            {jamKerja.is_active && (
              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 font-medium">
                Default Setting
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        <p>Dibuat: {new Date(jamKerja.created_at).toLocaleDateString('id-ID')}</p>
      </div>
    </div>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {isActive ? '🟢 Aktif' : '⚫ Nonaktif'}
    </span>
  );
}

function WaktuKerjaCard({ jamKerja, formatTime, calculateTotalHours }) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
        <Clock size={18} className="text-green-600" />
        Waktu Kerja Standar
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <TimeStat
          label="Masuk"
          value={formatTime(jamKerja.jam_masuk_standar)}
          bgColor="bg-green-100"
          textColor="text-green-800"
          borderColor="border-green-200"
        />
        <TimeStat
          label="Pulang"
          value={formatTime(jamKerja.jam_pulang_standar)}
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-200"
        />
      </div>
      <div className="mt-4 pt-3 border-t border-green-200 text-center">
        <p className="text-sm text-green-700 font-medium">
          Total Jam Kerja: {calculateTotalHours(jamKerja.jam_masuk_standar, jamKerja.jam_pulang_standar)}
        </p>
      </div>
    </div>
  );
}

function TimeStat({ label, value, bgColor, textColor, borderColor }) {
  return (
    <div className="text-center">
      <div className={`w-10 h-10 bg-white rounded-lg border ${borderColor} flex items-center justify-center mx-auto mb-2`}>
        <span className={`text-sm font-bold ${textColor}`}>{label[0]}</span>
      </div>
      <p className={`text-sm ${textColor.replace('800', '600')}`}>Jam {label}</p>
      <p className={`text-xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

function ToleransiCard({ jamKerja, formatTime }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-100">
        <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-600" />
          Toleransi Keterlambatan
        </h4>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-800 mb-1">
            {formatTime(jamKerja.toleransi_keterlambatan)}
          </p>
          <p className="text-sm text-amber-600">
            Waktu toleransi sebelum dianggap terlambat
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
        <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-600" />
          Batas Terlambat
        </h4>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-800 mb-1">
            {formatTime(jamKerja.batas_terlambat)}
          </p>
          <p className="text-sm text-red-600">
            Batas maksimal untuk melakukan presensi masuk
          </p>
        </div>
      </div>
    </div>
  );
}

function AdditionalInfo({ jamKerja, formatTime }) {
  const infoItems = [
    { icon: <Clock className="w-4 h-4 text-purple-600" />, label: "Shift", value: "Normal" },
    { icon: <CheckCircle className="w-4 h-4 text-blue-600" />, label: "Status", value: "Berlaku" },
    { icon: <Users className="w-4 h-4 text-green-600" />, label: "Pengguna", value: "Semua Karyawan" },
    { icon: <Calendar className="w-4 h-4 text-cyan-600" />, label: "Update", value: new Date(jamKerja.updated_at).toLocaleDateString('id-ID') }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
      <h4 className="font-semibold text-purple-800 mb-3">
        Informasi Tambahan
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {infoItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="w-8 h-8 bg-white rounded-lg border border-purple-200 flex items-center justify-center mx-auto mb-1">
              {item.icon}
            </div>
            <p className="text-xs text-purple-600">{item.label}</p>
            <p className="text-sm font-medium text-purple-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}