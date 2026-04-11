// components/kinerja/CameraUploader.jsx
"use client";

import { useState } from "react";
import { Camera, Image, X, MapPin, Download } from "lucide-react";
import CameraCapture from "./CameraCapture";

export default function CameraUploader({ 
  label, 
  description, 
  photoKey, 
  photoValue, 
  preview, 
  onFileChange, 
  onClear,
  locationData 
}) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);

  const handleCameraCapture = (photoData) => {
    if (photoData) {
      setTempPhoto(photoData);
      // Simpan foto sementara, belum submit ke form
    }
    setIsCameraOpen(false);
  };

  const handleConfirmPhoto = () => {
    if (tempPhoto) {
      // Buat event simulasi
      const syntheticEvent = {
        target: {
          name: photoKey,
          _base64Data: tempPhoto
        }
      };
      onFileChange(syntheticEvent, null);
      setTempPhoto(null);
    }
  };

  // Fungsi untuk download foto - TIDAK trigger submit
  const handleDownloadPhoto = (e) => {
    e.preventDefault();  // Cegah submit form
    e.stopPropagation(); // Cegah event bubbling
    
    if (tempPhoto) {
      const link = document.createElement('a');
      link.href = tempPhoto;
      link.download = `foto_${photoKey}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        <p className="text-xs text-slate-500 mb-3">{description}</p>
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt={label} 
              className="w-full h-32 object-cover rounded-lg border border-slate-200"
            />
            <button
              type="button"
              onClick={() => onClear(photoKey)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Camera size={16} />
              Kamera
            </button>
            
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer">
              <Image size={16} />
              Upload File
              <input
                type="file"
                name={photoKey}
                accept="image/*"
                onChange={(e) => onFileChange(e, null)}
                className="hidden"
              />
            </label>
          </div>
        )}
        
        {locationData?.coords && !preview && (
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <MapPin size={10} />
            <span>Lokasi akan terekam di foto</span>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onCapture={handleCameraCapture}
        onClose={() => {
          setIsCameraOpen(false);
          setTempPhoto(null);
        }}
        type={photoKey}
        locationData={locationData}
      />
      
      {/* Preview dengan tombol Download Hijau */}
      {tempPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold">Preview Foto</h3>
              <p className="text-sm text-slate-500">Download foto hasil tangkapan kamera</p>
            </div>
            <div className="p-4">
              <img 
                src={tempPhoto} 
                alt="Preview" 
                className="w-full rounded-lg"
              />
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-3">
              <button
                type="button"
                onClick={() => setTempPhoto(null)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Ambil Ulang
              </button>
              <button
                type="button"
                onClick={handleDownloadPhoto}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Foto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}