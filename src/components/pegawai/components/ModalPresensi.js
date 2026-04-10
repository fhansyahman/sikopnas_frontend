"use client";

import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import { presensiAPI } from "@/lib/api";

export default function ModalPresensi({ 
  showModal, 
  onClose, 
  user, 
  today, 
  currentTime,
  presensiHariIni,
  setPresensiHariIni 
}) {
  const [foto, setFoto] = useState(null);
  const [coords, setCoords] = useState(null);
  const [alamat, setAlamat] = useState([]);
  const [lokasiStatus, setLokasiStatus] = useState("Mengambil lokasi...");
  const [isLoading, setIsLoading] = useState(false);
  const [currentType, setCurrentType] = useState("masuk");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      setCurrentType(presensiHariIni.masuk ? "pulang" : "masuk");
      startCamera();
      ambilLokasi();
    } else {
      stopCamera();
      setFoto(null);
    }
  }, [showModal]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      alert("Tidak dapat mengakses kamera.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());
  };

  const ambilLokasi = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setCoords({ lat, lon });
        setLokasiStatus("Lokasi berhasil diambil");
        
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const addr = data.address || {};
          setAlamat([
            `Jalan: ${addr.road || "-"}`,
            `Kecamatan: ${addr.subdistrict || "-"}`,
            `Kabupaten: ${addr.city || "-"}`,
            `Koordinat: ${lat.toFixed(5)}, ${lon.toFixed(5)}`
          ]);
        } catch (err) {
          setAlamat([`Koordinat: ${lat.toFixed(5)}, ${lon.toFixed(5)}`]);
        }
      },
      (err) => {
        setLokasiStatus("Gagal mengambil lokasi.");
      }
    );
  };

  const ambilFoto = () => {
    if (!videoRef.current || !canvasRef.current || !coords) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setFoto(dataUrl);
  };

  const handleAbsen = async () => {
    if (!foto || !coords || !user) return;
    
    setIsLoading(true);
    try {
      const payload = currentType === "masuk" ? {
        foto_masuk: foto,
        latitude_masuk: coords.lat,
        longitude_masuk: coords.lon,
        user_id: user.id
      } : {
        foto_pulang: foto,
        latitude_pulang: coords.lat,
        longitude_pulang: coords.lon,
        user_id: user.id
      };

      const response = currentType === "masuk" 
        ? await presensiAPI.masuk(payload)
        : await presensiAPI.pulang(payload);

      alert(response.data?.data?.message || "Absen berhasil");
      
      // Update presensi lokal
      const jam = new Date().toLocaleTimeString("id-ID", { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
      
      setPresensiHariIni(prev => ({
        ...prev,
        [currentType === "masuk" ? "masuk" : "pulang"]: jam
      }));
      
      onClose();
    } catch (err) {
      alert("Gagal absen: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-slate-700">
            {currentType === "masuk" ? "Check In" : "Check Out"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{today} • {currentTime}</p>
        </div>

        {!foto ? (
          <>
            <div className="relative bg-slate-100 rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full aspect-video object-cover"
              />
            </div>
            <p className="mt-3 text-sm text-slate-600 text-center">{lokasiStatus}</p>

            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-4 flex justify-center">
              <button
                onClick={ambilFoto}
                disabled={!coords}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium ${
                  coords ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-400"
                }`}
              >
                <Camera size={16} /> Capture Photo
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative bg-slate-100 rounded-lg overflow-hidden">
              <img src={foto} alt="Preview" className="w-full aspect-video object-cover" />
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => setFoto(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm"
              >
                Retake
              </button>
              <button
                onClick={handleAbsen}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:bg-slate-400"
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </>
        )}

        <div className="mt-4 p-3 bg-slate-50 rounded-lg max-h-32 overflow-auto">
          <p className="text-xs text-slate-600 font-medium mb-1">Location:</p>
          {alamat.map((line, i) => (
            <p key={i} className="text-xs text-slate-500">{line}</p>
          ))}
        </div>

        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            Cancel
          </button>
          {foto && (
            <button
              onClick={handleAbsen}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}