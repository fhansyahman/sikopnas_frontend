"use client";

import { useState, useEffect, useRef } from "react";

export default function LocationInfo({ 
  onLocationChange, 
  onAlamatChange, 
  onStatusChange 
}) {
  const [coords, setCoords] = useState(null);
  const [alamat, setAlamat] = useState([]);
  const [status, setStatus] = useState("Mengambil lokasi...");
  const [isLoading, setIsLoading] = useState(false);
  
  // Use ref to track if this is the first render
  const isMounted = useRef(false);
  // Use ref to track previous values to prevent infinite loops
  const prevCoordsRef = useRef(null);
  const prevAlamatRef = useRef(null);
  const prevStatusRef = useRef(null);
  // Use ref to store callbacks to prevent dependency changes
  const callbacksRef = useRef({
    onLocationChange,
    onAlamatChange,
    onStatusChange
  });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = {
      onLocationChange,
      onAlamatChange,
      onStatusChange
    };
  }, [onLocationChange, onAlamatChange, onStatusChange]);

  // Only run once on mount
  useEffect(() => {
    ambilLokasi();
    
    // Set mounted flag after first render
    isMounted.current = true;
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Handle location changes - only when coords actually change and component is mounted
  useEffect(() => {
    // Skip if not mounted yet or no callback
    if (!isMounted.current || !callbacksRef.current.onLocationChange) return;
    
    // Skip if coords is null
    if (!coords) return;
    
    // Check if coords actually changed (deep compare)
    const coordsChanged = 
      !prevCoordsRef.current || 
      prevCoordsRef.current.lat !== coords.lat || 
      prevCoordsRef.current.lon !== coords.lon;
    
    if (coordsChanged) {
      callbacksRef.current.onLocationChange(coords);
      prevCoordsRef.current = { ...coords };
    }
  }, [coords]);

  // Handle alamat changes - only when alamat actually change
  useEffect(() => {
    // Skip if not mounted yet or no callback
    if (!isMounted.current || !callbacksRef.current.onAlamatChange) return;
    
    // Skip if alamat is empty
    if (alamat.length === 0) return;
    
    // Check if alamat actually changed
    const alamatString = JSON.stringify(alamat);
    const prevAlamatString = JSON.stringify(prevAlamatRef.current);
    
    if (alamatString !== prevAlamatString) {
      callbacksRef.current.onAlamatChange(alamat);
      prevAlamatRef.current = [...alamat];
    }
  }, [alamat]);

  // Handle status changes - only when status actually change
  useEffect(() => {
    // Skip if not mounted yet or no callback
    if (!isMounted.current || !callbacksRef.current.onStatusChange) return;
    
    // Check if status actually changed
    if (status !== prevStatusRef.current) {
      callbacksRef.current.onStatusChange(status);
      prevStatusRef.current = status;
    }
  }, [status]);

  const ambilLokasi = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation tidak didukung browser");
      return;
    }
    
    setIsLoading(true);
    setStatus("Mengambil lokasi...");
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Check if component is still mounted
        if (!isMounted.current) return;
        
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const locationData = { lat, lon };
        
        setCoords(locationData);
        setStatus("Lokasi berhasil diambil");
        setIsLoading(false);

        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          
          // Check if component is still mounted
          if (!isMounted.current) return;
          
          const addr = data.address || {};
          
          const alamatList = [
            `Jalan: ${addr.road || addr.residential || addr.footway || addr.path || "(nama jalan tidak tersedia)"}`,
            `Desa: ${addr.village || addr.suburb || ""}`,
            `Kecamatan: ${addr.subdistrict || addr.city_district || addr.town || addr.village || "(kecamatan tidak tersedia)"}`,
            `Kabupaten: ${addr.city || addr.county || ""}`,
            `Provinsi: ${addr.state || ""}`,
            `Negara: ${addr.country || ""}`,
            `Koordinat: ${lat.toFixed(5)}, ${lon.toFixed(5)}`,
            `Waktu: ${new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" })}`,
          ];
          
          setAlamat(alamatList);
        } catch (err) {
          // Check if component is still mounted
          if (!isMounted.current) return;
          
          console.warn("Reverse geocode gagal:", err);
          setAlamat([`Koordinat: ${lat.toFixed(5)}, ${lon.toFixed(5)}`]);
        }
      },
      (err) => {
        // Check if component is still mounted
        if (!isMounted.current) return;
        
        console.error("Gagal mengambil lokasi:", err);
        let errorMessage = "Gagal mengambil lokasi. ";
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += "Anda menolak izin akses lokasi.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Informasi lokasi tidak tersedia.";
            break;
          case err.TIMEOUT:
            errorMessage += "Waktu permintaan lokasi habis.";
            break;
          default:
            errorMessage += "Terjadi kesalahan tidak diketahui.";
        }
        
        setStatus(errorMessage);
        setIsLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 0, 
        timeout: 15000 
      }
    );
  };

  // Manual retry function
  const handleRetry = () => {
    setCoords(null);
    setAlamat([]);
    setStatus("Mengambil lokasi...");
    ambilLokasi();
  };

  return (
    <div className="mt-4 p-3 bg-slate-50 rounded-lg max-h-32 overflow-auto">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-slate-600 font-medium">Lokasi:</p>
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span className="text-xs text-slate-500">Mengambil lokasi...</span>
          </div>
        )}
        {!isLoading && status.includes("Gagal") && (
          <button 
            onClick={handleRetry}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Coba Lagi
          </button>
        )}
      </div>
      
      {alamat.length > 0 ? (
        <div className="space-y-0.5">
          {alamat.map((line, i) => (
            <p key={i} className="text-xs text-slate-500 truncate hover:text-clip hover:overflow-visible hover:whitespace-normal" title={line}>
              {line}
            </p>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {!isLoading && status.includes("Gagal") ? (
            <>
              <p className="text-xs text-red-500">{status}</p>
            </>
          ) : (
            <p className="text-xs text-slate-500">{status}</p>
          )}
        </div>
      )}
      
      {/* Success indicator */}
      {coords && !isLoading && (
        <div className="mt-1 flex items-center gap-1">
          <span className="text-xs text-green-600">Lokasi terdeteksi</span>
          <span className="text-xs text-slate-400">
            ({coords.lat.toFixed(5)}, {coords.lon.toFixed(5)})
          </span>
        </div>
      )}
    </div>
  );
}