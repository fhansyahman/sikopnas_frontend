"use client";

import { X } from "lucide-react";
import { useImageHandler } from "../../hooks/kinerja/useImageHandler";

export function ImageModal({ isOpen, imageUrl, onClose }) {
  const { downloadImage, getFilenameFromUrl } = useImageHandler();

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>

        <div className="mt-3 flex justify-center gap-3">
          <button
            onClick={() => downloadImage(imageUrl, getFilenameFromUrl(imageUrl))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Download
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}