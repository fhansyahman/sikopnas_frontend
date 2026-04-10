"use client";

import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";

export function ImageViewerModal({
  isOpen,
  onClose,
  selectedImage,
  currentImageIndex,
  onNavigate,
  onDownload,
  imageList,
  kinerja
}) {
  if (!isOpen || !selectedImage) return null;

  const getImageLabel = (index) => {
    if (!kinerja) return '';
    
    if (index === 0 && kinerja.sket_image === imageList[0]) return 'Sket';
    if (index === 0 && kinerja.foto_0 === imageList[0]) return 'Foto 0%';
    if (index === 1 && kinerja.foto_50 === imageList[1]) return 'Foto 50%';
    if (index === 2 && kinerja.foto_100 === imageList[2]) return 'Foto 100%';
    
    // Fallback berdasarkan posisi
    const positions = ['Sket', 'Foto 0%', 'Foto 50%', 'Foto 100%'];
    return positions[index] || `Gambar ${index + 1}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={24} />
        </button>
        
        {/* Download Button */}
        <button
          onClick={() => onDownload(selectedImage)}
          className="absolute top-16 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          title="Download gambar"
        >
          <Download size={20} />
        </button>
        
        {/* Navigation Buttons */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={() => onNavigate('prev', imageList)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => onNavigate('next', imageList)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {imageList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-3 py-1 bg-black/50 text-white rounded-full text-sm">
            {currentImageIndex + 1} / {imageList.length}
          </div>
        )}
        
        {/* Main Image */}
        <img 
          src={selectedImage} 
          alt="Preview" 
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
        
        {/* Image Info */}
        <div className="absolute bottom-4 left-4 z-10">
          <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {getImageLabel(currentImageIndex)}
          </p>
        </div>
      </div>
    </div>
  );
}