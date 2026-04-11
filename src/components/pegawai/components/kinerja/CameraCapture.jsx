"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, MapPin, Loader2, RefreshCw } from "lucide-react";
import GoogleMapEmbed from "@/components/pegawai/dashboard/MapView";

export default function CameraCapture({ onCapture, onClose, isOpen }) {
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [currentCameraMode, setCurrentCameraMode] = useState("back");
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [actualCameraLabel, setActualCameraLabel] = useState("");

  const [locationData, setLocationData] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [mapImage, setMapImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isMounted = useRef(true);

  // =========================
  // 📍 GET LOCATION + STATIC MAP
  // =========================
  const getLocation = async () => {
    setLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();

          setLocationData({
            coords: { lat, lon },
            address: data.display_name,
          });

          // 🔥 STATIC MAP untuk canvas
          const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&size=300,200&z=17&l=sat&pt=${lon},${lat},pm2rdm`;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = mapUrl;

          img.onload = () => {
            setMapImage(img);
          };
        } catch {
          setLocationData({
            coords: { lat, lon },
            address: "Alamat tidak ditemukan",
          });
        }

        setLoadingLocation(false);
      },
      () => {
        setLocationError("Gagal mengambil lokasi");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // =========================
  // 📷 CAMERA - BACK CAMERA PRIORITY
  // =========================
  
  // Dapatkan daftar kamera
  const getCameraDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        return [];
      }
      
      // Minta izin kamera dulu agar label terisi
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log("Available cameras:", videoDevices.map(d => ({ label: d.label, id: d.deviceId })));
      
      setCameraDevices(videoDevices);
      return videoDevices;
      
    } catch (error) {
      console.error("Error mendapatkan daftar kamera:", error);
      return [];
    }
  };

  // Dapatkan label kamera yang sebenarnya
  const getActualCameraLabel = (devices, mode) => {
    if (mode === "back") {
      const backCamera = devices.find(d => {
        const label = d.label.toLowerCase();
        return label.includes('back') || label.includes('rear') || label.includes('environment');
      });
      if (backCamera) return "Belakang";
    } else {
      const frontCamera = devices.find(d => {
        const label = d.label.toLowerCase();
        return label.includes('front') || label.includes('user') || label.includes('face');
      });
      if (frontCamera) return "Depan";
    }
    return mode === "back" ? "Belakang" : "Depan";
  };

  const startCamera = async () => {
    try {
      // Dapatkan daftar kamera
      const devices = await getCameraDevices();
      
      // Cari kamera belakang
      let backCamera = devices.find(d => {
        const label = d.label.toLowerCase();
        return label.includes('back') || label.includes('rear') || label.includes('environment');
      });
      
      // Jika tidak ditemukan berdasarkan label, coba gunakan deviceId yang lebih panjang
      if (!backCamera && devices.length > 0) {
        backCamera = devices.find(d => d.deviceId && d.deviceId.length > 20) || devices[0];
      }
      
      // Constraints untuk kamera belakang
      let constraints;
      if (backCamera) {
        constraints = {
          video: { deviceId: { exact: backCamera.deviceId } },
          audio: false
        };
      } else {
        constraints = {
          video: { facingMode: "environment" },
          audio: false
        };
      }
      
      console.log("Starting back camera with constraints:", constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      setCurrentCameraMode("back");
      setActualCameraLabel(getActualCameraLabel(devices, "back"));

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsVideoReady(true);
      }
      
    } catch (error) {
      console.error("Error starting back camera:", error);
      
      // Fallback: coba dengan facingMode environment
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
        setStream(fallbackStream);
        setCurrentCameraMode("back");
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play();
          setIsVideoReady(true);
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }
  };

  // Ganti kamera (jika diperlukan)
  const switchCamera = async () => {
    if (cameraDevices.length < 2) {
      alert("Hanya ditemukan 1 kamera. Tidak bisa mengganti.");
      return;
    }
    
    setIsSwitchingCamera(true);
    
    try {
      // Tentukan mode baru
      const newMode = currentCameraMode === "front" ? "back" : "front";
      
      // Cari deviceId untuk mode baru
      let targetDeviceId = null;
      if (newMode === "back") {
        const backCamera = cameraDevices.find(d => {
          const label = d.label.toLowerCase();
          return label.includes('back') || label.includes('rear') || label.includes('environment');
        });
        targetDeviceId = backCamera?.deviceId;
      } else {
        const frontCamera = cameraDevices.find(d => {
          const label = d.label.toLowerCase();
          return label.includes('front') || label.includes('user') || label.includes('face');
        });
        targetDeviceId = frontCamera?.deviceId;
      }
      
      // Hentikan stream lama
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Mulai kamera baru
      let constraints;
      if (targetDeviceId) {
        constraints = {
          video: { deviceId: { exact: targetDeviceId } },
          audio: false
        };
      } else {
        constraints = {
          video: { facingMode: newMode === "back" ? "environment" : "user" },
          audio: false
        };
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setCurrentCameraMode(newMode);
      setActualCameraLabel(getActualCameraLabel(cameraDevices, newMode));
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
        setIsVideoReady(true);
      }
      
    } catch (error) {
      console.error("Error switching camera:", error);
      alert("Gagal mengganti kamera. Silakan coba lagi.");
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      getLocation();
      startCamera();
    } else {
      stopCamera();
      setPhoto(null);
      setIsVideoReady(false);
    }
  }, [isOpen]);

  // =========================
  // TEXT WRAP
  // =========================
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const width = ctx.measureText(testLine).width;

      if (width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  // =========================
  // 📸 TAKE PHOTO
  // =========================
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    // 🔥 MAP + INFO SIDE BY SIDE
    if (locationData?.coords) {
      const boxHeight = 120;
      const boxY = canvas.height - boxHeight - 10;
      const padding = 10;

      // Background
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(10, boxY, canvas.width - 20, boxHeight);

      // ===== MAP (KIRI) =====
      const mapWidth = 140;
      const mapHeight = 100;

      if (mapImage) {
        ctx.drawImage(
          mapImage,
          15,
          boxY + 10,
          mapWidth,
          mapHeight
        );
      }

      // ===== INFO (KANAN) =====
      const textX = 15 + mapWidth + 10;
      let textY = boxY + 25;

      ctx.fillStyle = "#fff";

      const lat = locationData.coords.lat.toFixed(6);
      const lon = locationData.coords.lon.toFixed(6);
      const date = new Date().toLocaleString("id-ID");

      ctx.font = "bold 14px Arial";
      ctx.fillText("📍 Lokasi:", textX, textY);

      ctx.font = "12px Arial";
      wrapText(
        ctx,
        locationData.address,
        textX,
        textY + 18,
        canvas.width - textX - 20,
        14
      );
      ctx.fillText(`Lat: ${lat}`, textX, textY + 65);
      ctx.fillText(`Long: ${lon}`, textX, textY + 80);
      ctx.fillText(date, textX, textY + 95);
    }

    const img = canvas.toDataURL("image/jpeg", 0.95);
    setPhoto(img);
    onCapture?.(img);

    stopCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between p-3 border-b">
          <h3 className="font-semibold">Ambil Foto</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-3">
          {!photo ? (
            <>
              {/* Camera Controls */}
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-slate-600">
                  Kamera: <span className="font-medium">
                    {actualCameraLabel || "Belakang"}
                  </span>
                </div>
                {cameraDevices.length > 1 && (
                  <button
                    onClick={switchCamera}
                    disabled={isSwitchingCamera}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                  >
                    <RefreshCw size={14} className={isSwitchingCamera ? "animate-spin" : ""} />
                    Ganti Kamera
                  </button>
                )}
              </div>

              <video ref={videoRef} className="w-full rounded-lg" autoPlay playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* 🔥 MAP + INFO PREVIEW */}
              {locationData && (
                <div className="mt-2 flex gap-2">
                  <div className="w-1/2">
                    <GoogleMapEmbed locationData={locationData} />
                  </div>

                  <div className="w-1/2 text-xs bg-slate-100 rounded-lg p-2">
                    <div className="font-semibold flex items-center gap-1 mb-1">
                      <MapPin size={12} />
                      Lokasi
                    </div>
                    <div className="line-clamp-4">{locationData.address}</div>
                    <div className="mt-1">
                      {locationData.coords.lat.toFixed(5)},{" "}
                      {locationData.coords.lon.toFixed(5)}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-center">
                <button
                  onClick={takePhoto}
                  disabled={!isVideoReady || loadingLocation}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Camera />
                </button>
              </div>
            </>
          ) : (
            <img src={photo} className="w-full rounded-lg" />
          )}
        </div>

        {/* INFO LOKASI */}
        <div className="p-3 border-t text-xs">
          {loadingLocation && (
            <div className="flex gap-2">
              <Loader2 className="animate-spin" size={14} />
              Mengambil lokasi...
            </div>
          )}

          {locationError && <div className="text-red-500">{locationError}</div>}

          {locationData && (
            <div>
              <div className="flex items-center gap-1 font-semibold">
                <MapPin size={12} />
                Lokasi:
              </div>
              <div>{locationData.address}</div>
              <div>
                {locationData.coords.lat.toFixed(5)},{" "}
                {locationData.coords.lon.toFixed(5)}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex p-3 border-t">
          <button
            onClick={onClose}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}