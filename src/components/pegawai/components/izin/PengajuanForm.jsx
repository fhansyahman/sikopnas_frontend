"use client";

import { useRef } from "react";
import { Upload, X, File } from "lucide-react";
import { useIzinForm } from "../../hooks/izin/useIzinForm";
import { useFileHandler } from "../../hooks/izin/useFileHandler";
import { FileUploader } from "./FileUploader";

export function PengajuanForm({ editData, onSuccess, onCancel }) {
  const fileInputRef = useRef(null);
  const {
    formData,
    uploadedFiles,
    existingDokumen,
    loading,
    jenisIzinOptions,
    handleChange,
    handleFileUpload,
    removeFile,
    handleSubmit
  } = useIzinForm(editData, onSuccess);

  const { handleViewDocument, getFileName, formatFileSize } = useFileHandler();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-black">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {editData ? "Edit Pengajuan Izin" : "Pengajuan Izin Baru"}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {editData 
            ? "Perbarui informasi pengajuan izin Anda" 
            : "Isi formulir untuk mengajukan izin baru"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Izin *
            </label>
            <select
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required
            >
              <option value="">Pilih Jenis Izin</option>
              {jenisIzinOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai *
              </label>
              <input
                type="date"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Selesai *
              </label>
              <input
                type="date"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keterangan / Alasan Izin
          </label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            placeholder="Tuliskan keterangan atau alasan pengajuan izin..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            rows={4}
          />
        </div>

        {/* Dokumen yang sudah ada (saat edit) */}
        {existingDokumen && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dokumen Saat Ini
            </label>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3">
                <File className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {getFileName(existingDokumen)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dokumen saat ini
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleViewDocument(existingDokumen)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Lihat
              </button>
            </div>
          </div>
        )}

        {/* File Uploader */}
        <FileUploader
          fileInputRef={fileInputRef}
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onRemoveFile={removeFile}
          formatFileSize={formatFileSize}
        />

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>{editData ? "Perbarui Izin" : "Ajukan Izin"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}