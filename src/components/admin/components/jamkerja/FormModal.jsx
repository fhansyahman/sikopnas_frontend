"use client";

import { X, AlertCircle } from "lucide-react";
import { useFormJamKerja } from "../../hooks/jamkerja/useFormJamKerja";

export function FormModal({ showModal, onClose, editingJamKerja, onSubmit }) {
  const { formData, handleChange, handleSubmit, handleClose } = useFormJamKerja(
    editingJamKerja,
    onSubmit,
    onClose
  );

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {editingJamKerja ? 'Edit Setting Jam Kerja' : 'Tambah Setting Jam Kerja'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Nama Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Setting *
              </label>
              <input
                type="text"
                name="nama_setting"
                value={formData.nama_setting}
                onChange={handleChange}
                placeholder="Contoh: Jam Kerja Standar, Shift Pagi, dll."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            {/* Jam Masuk & Pulang */}
            <div className="grid grid-cols-2 gap-4">
              <TimeInput
                label="Jam Masuk Standar *"
                name="jam_masuk_standar"
                value={formData.jam_masuk_standar}
                onChange={handleChange}
              />
              <TimeInput
                label="Jam Pulang Standar *"
                name="jam_pulang_standar"
                value={formData.jam_pulang_standar}
                onChange={handleChange}
              />
            </div>

            {/* Toleransi & Batas */}
            <div className="grid grid-cols-2 gap-4">
              <TimeInput
                label="Toleransi Keterlambatan"
                name="toleransi_keterlambatan"
                value={formData.toleransi_keterlambatan}
                onChange={handleChange}
                helperText="Waktu toleransi sebelum dianggap terlambat"
              />
              <TimeInput
                label="Batas Terlambat"
                name="batas_terlambat"
                value={formData.batas_terlambat}
                onChange={handleChange}
                helperText="Batas maksimal presensi masuk"
              />
            </div>

            {/* Checkbox Active */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <label htmlFor="is_active" className="text-sm text-gray-700 font-medium">
                  Jadikan sebagai setting aktif
                </label>
                <p className="text-xs text-blue-600">
                  Setting lain akan otomatis dinonaktifkan
                </p>
              </div>
            </div>

            {/* Warning */}
            {formData.is_active && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Perhatian</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  Dengan mengaktifkan setting ini, semua setting jam kerja lainnya akan dinonaktifkan secara otomatis.
                </p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-green-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700"
            >
              {editingJamKerja ? 'Update Setting' : 'Simpan Setting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TimeInput({ label, name, value, onChange, helperText }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        required={label.includes('*')}
      />
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}