"use client";

import { useState } from "react";

export function useLocation() {
  const [coords, setCoords] = useState(null);
  const [alamat, setAlamat] = useState([]);
  const [status, setStatus] = useState("Mengambil lokasi...");

  const ambilLokasi = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation tidak didukung browser");
      return null;
    }

    return new Promise((resolve) => {
      setStatus("Mengambil lokasi...");
      
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const locationData = { lat, lon };
          
          setCoords(locationData);
          setStatus("Lokasi berhasil diambil");
          
          await reverseGeocode(lat, lon);
          resolve(locationData);
        },
        (err) => {
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
          resolve(null);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
      );
    });
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
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
      console.warn("Reverse geocode gagal:", err);
      setAlamat([`Koordinat: ${lat.toFixed(5)}, ${lon.toFixed(5)}`]);
    }
  };

  return {
    coords,
    alamat,
    status,
    setCoords,
    setAlamat,
    setStatus,
    ambilLokasi,
    reverseGeocode
  };
}