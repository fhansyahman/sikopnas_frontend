// components/kinerja/KinerjaForm.jsx
"use client";

import { useState, useEffect } from "react";
import { MapPin, Ruler, FileText, Camera, Pickaxe, Calendar, Clock } from "lucide-react";
import { useKinerjaForm } from "../../hooks/kinerja/useKinerjaForm";
import { useCanvasDrawing } from "../../hooks/kinerja/useCanvasDrawing";
import { SketJalanCanvas } from "./SketJalanCanvas";
import CameraUploader from "./CameraUploader";

export function KinerjaForm({ editData, onSuccess, onCancel, locationData, userName = "Karyawan" }) {
  const {
    form,
    preview,
    loading,
    error,
    daftarKegiatan,
    handleChange,
    handleFileChange,
    clearPhoto,
    handleSubmit
  } = useKinerjaForm(editData, onSuccess);

  const {
    canvasRef,
    selectedArea,
    color,
    currentColors,
    sections,
    setColor,
    handleCanvasClick,
    handleColorApply,
    handleResetColors,
    getSketImage
  } = useCanvasDrawing();

  const [sketImage, setSketImage] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Update waktu realtime
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(timeStr);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const sketImageData = getSketImage();
    const success = await handleSubmit(e, sketImageData);
    if (success) {
      onSuccess();
    }
  };

  // Format tanggal untuk display
  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header dengan waktu realtime */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {editData ? "Edit Laporan Kinerja" : "Laporan Kinerja Baru"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {editData 
                ? "Perbarui informasi laporan kinerja" 
                : "Isi formulir untuk membuat laporan kinerja baru"
              }
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <Clock size={14} />
              <span>{currentTime} WIB</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Informasi Dasar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tanggal *
            </label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kegiatan *
            </label>
            <div className="relative">
              <input
                type="text"
                name="kegiatan"
                value={form.kegiatan}
                onChange={handleChange}
                placeholder="Contoh: Pembersihan Jalan"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pl-10"
                required
              >
              </input>
              <Pickaxe className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Ruas Jalan */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Ruas Jalan *
          </label>
          <div className="relative">
            <input
              type="text"
              name="ruas_jalan"
              value={form.ruas_jalan}
              onChange={handleChange}
              placeholder="Contoh: Jalan Merdeka - Jalan Sudirman"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pl-10"
              required
            />
            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Panjang Pekerjaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Panjang KR (meter) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="panjang_kr"
                value={form.panjang_kr}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pl-10"
                required
              />
              <Ruler className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-400 mt-1">Panjang Kerusakan Ringan (KR)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Panjang KN (meter) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="panjang_kn"
                value={form.panjang_kn}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pl-10"
                required
              />
              <Ruler className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-400 mt-1">Panjang Kerusakan Berat (KN)</p>
          </div>
        </div>

        {/* Sket Jalan dengan Color Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sketsa Jalan
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Klik pada area jalan untuk menandai bagian yang dikerjakan. Gunakan warna berbeda untuk membedakan area.
          </p>
          <SketJalanCanvas
            canvasRef={canvasRef}
            selectedArea={selectedArea}
            color={color}
            sections={sections}
            currentColors={currentColors}
            onCanvasClick={handleCanvasClick}
            onColorChange={setColor}
            onColorApply={handleColorApply}
            onResetColors={handleResetColors}
          />
        </div>

        {/* Dokumentasi Foto with Camera Support */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-slate-700 flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Dokumentasi Progress</span>
            </label>
            {locationData?.coords && (
              <div className="text-xs text-green-600 flex items-center gap-1">
                <MapPin size={12} />
                <span>Lokasi terdeteksi</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CameraUploader
              label="Awal (0%)"
              description="Foto sebelum pekerjaan dimulai"
              photoKey="foto_0"
              photoValue={form.foto_0}
              preview={preview.foto_0}
              onFileChange={handleFileChange}
              onClear={clearPhoto}
              locationData={locationData}
              userName={userName}
              photoType="awal"
            />
            
            <CameraUploader
              label="Progress (50%)"
              description="Foto saat pekerjaan berjalan 50%"
              photoKey="foto_50"
              photoValue={form.foto_50}
              preview={preview.foto_50}
              onFileChange={handleFileChange}
              onClear={clearPhoto}
              locationData={locationData}
              userName={userName}
              photoType="progress"
            />
            
            <CameraUploader
              label="Selesai (100%)"
              description="Foto setelah pekerjaan selesai"
              photoKey="foto_100"
              photoValue={form.foto_100}
              preview={preview.foto_100}
              onFileChange={handleFileChange}
              onClear={clearPhoto}
              locationData={locationData}
              userName={userName}
              photoType="selesai"
            />
          </div>
          
          <p className="text-xs text-slate-400 mt-3 text-center">
            * Gunakan kamera untuk mengambil foto dengan peta satelit dan informasi lokasi otomatis
          </p>
        </div>

        {/* Informasi Lokasi (Ringkasan) */}
        {locationData?.alamat && locationData.alamat.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-blue-500" />
              <span className="text-xs font-medium text-slate-700">Informasi Lokasi Saat Ini</span>
            </div>
            <div className="space-y-0.5">
              {locationData.alamat.slice(0, 3).map((line, idx) => (
                <p key={idx} className="text-xs text-slate-500 truncate">{line}</p>
              ))}
              {locationData.coords && (
                <p className="text-xs text-slate-400 mt-1">
                  Koordinat: {locationData.coords.lat.toFixed(6)}, {locationData.coords.lon.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tombol Submit */}
        <div className="flex space-x-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>{editData ? "Perbarui Laporan" : "Simpan Laporan"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}