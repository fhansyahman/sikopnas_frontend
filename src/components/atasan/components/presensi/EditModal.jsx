"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export function EditModal({ 
  isOpen, 
  onClose, 
  presensi, 
  onSubmit,
  onRefresh,
  formatDate,
  formatTime
}) {
  const [formData, setFormData] = useState({
    jam_masuk: '',
    jam_pulang: '',
    status_masuk: '',
    status_pulang: '',
    keterangan: '',
    is_lembur: false,
    jam_lembur: '',
    izin_id: null,
    foto_masuk: '',
    foto_pulang: ''
  });

  // ✅ FIX: Safe useEffect dengan null checking
  useEffect(() => {
    if (presensi && isOpen) {
      setFormData({
        jam_masuk: presensi.jam_masuk || '',
        jam_pulang: presensi.jam_pulang || '',
        status_masuk: presensi.status_masuk || '',
        status_pulang: presensi.status_pulang || '',
        keterangan: presensi.keterangan || '',
        is_lembur: presensi.is_lembur === 1 ? true : false,
        jam_lembur: presensi.jam_lembur || '',
        izin_id: presensi.izin_id || null,
        foto_masuk: presensi.foto_masuk ? 'keep' : '',
        foto_pulang: presensi.foto_pulang ? 'keep' : ''
      });
    }
  }, [presensi, isOpen]);

  // ✅ FIX: Early return jika modal tidak open
  if (!isOpen) return null;
  
  // ✅ FIX: Tampilkan loading jika presensi null tapi modal open
  if (!presensi) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Memuat data presensi...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ FIX: Safe access dengan default values
  const nama = presensi?.nama || '-';
  const tanggal = presensi?.tanggal;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (name, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, [name]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ FIX: Validasi ID presensi
    if (!presensi?.id) {
      alert('ID presensi tidak ditemukan');
      return;
    }
    
    const success = await onSubmit(presensi.id, formData);
    if (success) {
      onClose();
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Data Presensi</h2>
            <p className="text-sm text-blue-600">
              {nama} - {tanggal ? formatDate(tanggal) : '-'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Info Note */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Catatan:</strong> Jika pegawai memiliki izin (izin_id tidak null), status akan otomatis dianggap Izin.
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Jam Masuk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jam Masuk
              </label>
              <input
                type="time"
                name="jam_masuk"
                value={formData.jam_masuk || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            {/* Jam Pulang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jam Pulang
              </label>
              <input
                type="time"
                name="jam_pulang"
                value={formData.jam_pulang || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            {/* Status Masuk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Masuk
              </label>
              <select
                name="status_masuk"
                value={formData.status_masuk || ''}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setFormData(prev => ({ 
                    ...prev, 
                    status_masuk: newStatus,
                    ...(newStatus !== 'Izin' && { izin_id: null })
                  }));
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Pilih Status</option>
                <option value="Tepat Waktu">Tepat Waktu</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Tanpa Keterangan">Tanpa Keterangan</option>
                <option value="Izin">Izin</option>
              </select>
            </div>

            {/* Status Pulang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Pulang
              </label>
              <select
                name="status_pulang"
                value={formData.status_pulang || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Pilih Status</option>
                <option value="Tepat Waktu">Tepat Waktu</option>
                <option value="Cepat Pulang">Cepat Pulang</option>
                <option value="Belum Pulang">Belum Pulang</option>
                <option value="Lembur">Lembur</option>
                <option value="Izin">Izin</option>
                <option value="Tanpa Keterangan">Tanpa Keterangan</option>
              </select>
            </div>

            {/* Foto Masuk */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Masuk Baru (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileChange('foto_masuk', file);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              {presensi?.foto_masuk && !formData.foto_masuk && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <p className="text-xs text-green-600">Foto masuk sudah ada</p>
                </div>
              )}
            </div>

            {/* Foto Keluar */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Keluar Baru (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileChange('foto_pulang', file);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              {presensi?.foto_pulang && !formData.foto_pulang && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <p className="text-xs text-green-600">Foto keluar sudah ada</p>
                </div>
              )}
            </div>

            {/* Checkbox Lembur */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_lembur"
                  name="is_lembur"
                  checked={formData.is_lembur || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_lembur" className="text-sm text-gray-700">
                  Lembur
                </label>
              </div>
            </div>

            {/* Jam Lembur */}
            {formData.is_lembur && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Lembur (HH:MM)
                </label>
                <input
                  type="text"
                  name="jam_lembur"
                  value={formData.jam_lembur || ''}
                  onChange={handleChange}
                  placeholder="Contoh: 02:30"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            )}

            {/* Keterangan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keterangan
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan || ''}
                onChange={handleChange}
                placeholder="Masukkan keterangan tambahan..."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2"
            >
              <Save size={16} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}