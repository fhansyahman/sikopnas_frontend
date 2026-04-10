"use client";

import { Upload, Trash2, ZoomIn } from "lucide-react";

export function FotoUploader({
  label,
  description,
  photoKey,
  photoValue,
  preview,
  onFileChange,
  onClear,
  onView
}) {
  return (
    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors bg-slate-50/50">
      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <p className="text-xs text-slate-500 mb-3">{description}</p>
      
      <input
        type="file"
        name={photoKey}
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        id={photoKey}
      />
      <label
        htmlFor={photoKey}
        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium cursor-pointer inline-block mb-3"
      >
        Pilih File
      </label>

      {(preview || photoValue) && (
        <div className="mt-3 space-y-2">
          <img
            src={preview || photoValue || ''}
            alt={label}
            className="w-full h-32 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onView && onView(preview || photoValue)}
          />
          <div className="flex justify-center space-x-3">
            {onView && (
              <button
                type="button"
                onClick={() => onView(preview || photoValue)}
                className="flex items-center justify-center space-x-1 text-sm text-green-600 hover:text-green-700"
              >
                <ZoomIn className="w-4 h-4" />
                <span>Lihat</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onClear(photoKey)}
              className="flex items-center justify-center space-x-1 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}