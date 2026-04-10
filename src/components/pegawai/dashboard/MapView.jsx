// components/pegawai/dashboard/GoogleMapEmbed.jsx
"use client";

import { useState, useEffect } from "react";

export default function GoogleMapEmbed({ locationData, className = "" }) {
  const [mapUrl, setMapUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!locationData?.coords) {
      setIsLoading(false);
      return;
    }

    const { lat, lon } = locationData.coords;
    
    // Menggunakan Google Maps embed URL - tidak memerlukan API key
    const url = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
    
    setMapUrl(url);
    setIsLoading(false);
  }, [locationData]);

  if (isLoading) {
    return (
      <div className={`w-full h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Memuat peta...</p>
        </div>
      </div>
    );
  }

  if (!mapUrl) {
    return (
      <div className={`w-full h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center ${className}`}>
        <p className="text-xs text-slate-500">Lokasi tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 ${className}`}>
      <iframe
        title="Google Maps Location"
        src={mapUrl}
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      {/* Overlay info */}
      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
        <span>📍 Lokasi Saat Ini</span>
      </div>
      
      {locationData?.coords?.accuracy && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          Akurasi: ±{Math.round(locationData.coords.accuracy)}m
        </div>
      )}
      
      <a 
        href={`https://www.google.com/maps?q=${locationData?.coords?.lat},${locationData?.coords?.lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition-colors z-10"
      >
        Buka di Google Maps
      </a>
    </div>
  );
}