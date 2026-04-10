"use client";

import { useState } from "react";
import { X, Save, PaintBucket, Image } from "lucide-react";
import Swal from "sweetalert2";
import { adminKinerjaAPI } from "@/lib/api";

export function EditModal({
  isOpen,
  onClose,
  kinerja,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ruas_jalan: kinerja?.ruas_jalan || '',
    kegiatan: kinerja?.kegiatan || '',
    panjang_kr: kinerja?.panjang_kr || '',
    panjang_kn: kinerja?.panjang_kn || '',
    warna_sket: {
      warna1: kinerja?.warna_sket?.warna1 || '',
      warna2: kinerja?.warna_sket?.warna2 || '',
      warna3: kinerja?.warna_sket?.warna3 || ''
    },
    sket_image: kinerja?.sket_image || '',
    foto_0: kinerja?.foto_0 || '',
    foto_50: kinerja?.foto_50 || '',
    foto_100: kinerja?.foto_100 || ''
  });

  if (!isOpen || !kinerja) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWarnaChange = (warna, value) => {
    setFormData(prev => ({
      ...prev,
      warna_sket: { ...prev.warna_sket, [warna]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.ruas_jalan || !formData.kegiatan || !formData.panjang_kr || !formData.panjang_kn) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Lengkap",
        text: "Harap lengkapi semua field yang wajib diisi",
        confirmButtonText: "Oke",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    setLoading(true);
    try {
      await adminKinerjaAPI.update(kinerja.id, formData);
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data kinerja berhasil diupdate",
        confirmButtonText: "Oke",
        confirmButtonColor: "#10B981",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating kinerja:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal update data kinerja',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">Edit Data Kinerja</h2>
            <p className="text-sm text-blue-600 truncate">
              {kinerja.nama} - {new Date(kinerja.tanggal).toLocaleDateString('id-ID')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Catatan:</strong> Semua field yang bertanda * wajib diisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Ruas Jalan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruas Jalan *
              </label>
              <input
                type="text"
                name="ruas_jalan"
                value={formData.ruas_jalan}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            {/* Kegiatan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kegiatan *
              </label>
              <textarea
                name="kegiatan"
                value={formData.kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                rows={3}
                required
              />
            </div>

            {/* Panjang KR & KN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Panjang KR *
              </label>
              <input
                type="text"
                name="panjang_kr"
                value={formData.panjang_kr}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Panjang KN *
              </label>
              <input
                type="text"
                name="panjang_kn"
                value={formData.panjang_kn}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            {/* Warna Sket */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <PaintBucket size={16} />
                Warna Sket (Opsional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <WarnaInput
                  label="Warna 1"
                  value={formData.warna_sket.warna1}
                  onChange={(val) => handleWarnaChange('warna1', val)}
                />
                <WarnaInput
                  label="Warna 2"
                  value={formData.warna_sket.warna2}
                  onChange={(val) => handleWarnaChange('warna2', val)}
                />
                <WarnaInput
                  label="Warna 3"
                  value={formData.warna_sket.warna3}
                  onChange={(val) => handleWarnaChange('warna3', val)}
                />
              </div>
            </div>

            {/* Upload Gambar */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Image size={16} />
                URL Gambar (Opsional)
              </label>
              <div className="space-y-3">
                <ImageUrlInput
                  label="URL Sket Image"
                  name="sket_image"
                  value={formData.sket_image}
                  onChange={handleChange}
                  placeholder="https://example.com/sket.jpg"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <ImageUrlInput
                    label="URL Foto 0%"
                    name="foto_0"
                    value={formData.foto_0}
                    onChange={handleChange}
                    placeholder="https://example.com/foto0.jpg"
                  />
                  <ImageUrlInput
                    label="URL Foto 50%"
                    name="foto_50"
                    value={formData.foto_50}
                    onChange={handleChange}
                    placeholder="https://example.com/foto50.jpg"
                  />
                  <ImageUrlInput
                    label="URL Foto 100%"
                    name="foto_100"
                    value={formData.foto_100}
                    onChange={handleChange}
                    placeholder="https://example.com/foto100.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 flex flex-wrap justify-end gap-2 md:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 md:px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 flex-1 md:flex-none"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 md:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-2 flex-1 md:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sub-components
function WarnaInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
      />
    </div>
  );
}

function ImageUrlInput({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
      />
    </div>
  );
}