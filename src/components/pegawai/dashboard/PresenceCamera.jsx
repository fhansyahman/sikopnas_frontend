"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, RefreshCw, MapPin } from "lucide-react";

export default function PresenceCamera({ 
  onCapture, 
  onClose, 
  isOpen, 
  type,
  isSubmitting = false,
  locationData 
}) {
  const [stream, setStream] = useState(null);
  const [foto, setFoto] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [currentCameraMode, setCurrentCameraMode] = useState("front");
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapContainerRef = useRef(null);
  const playPromiseRef = useRef(null);
  const isMounted = useRef(true);

  // Load Leaflet scripts dengan aman
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadLeaflet = async () => {
      try {
        // Cek apakah sudah terload
        if (window.L && window.leafletImage) {
          setLeafletLoaded(true);
          return;
        }

        // Load CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Load leaflet-image
        if (!window.leafletImage) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet-image/leaflet-image.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        setLeafletLoaded(true);
        console.log('✅ Leaflet loaded successfully');
      } catch (error) {
        console.error('❌ Error loading Leaflet:', error);
      }
    };

    loadLeaflet();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      stopCamera();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Hentikan kamera saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setFoto(null);
      setCameraError(null);
      setIsVideoReady(false);
      setIsMapReady(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    }
  }, [isOpen]);

  // Mulai kamera saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (isMounted.current) {
          startCamera();
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    }
  }, [isOpen]);

  // Inisialisasi peta saat lokasi tersedia
  useEffect(() => {
    if (isOpen && locationData?.coords?.lat && locationData?.coords?.lon && leafletLoaded && window.L) {
      // Beri sedikit delay untuk memastikan semuanya siap
      setTimeout(() => {
        initMap(locationData.coords.lat, locationData.coords.lon);
      }, 500);
    }
  }, [isOpen, locationData, leafletLoaded]);

  const stopCamera = () => {
    try {
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {}).catch(() => {});
        playPromiseRef.current = null;
      }

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        setStream(null);
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsVideoReady(false);
    } catch (err) {
      console.warn("Gagal stop camera:", err);
    }
  };

  const playVideo = async (videoElement) => {
    if (!videoElement) return;
    
    try {
      if (playPromiseRef.current) {
        await playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }

      const playPromise = videoElement.play();
      playPromiseRef.current = playPromise;
      
      await playPromise;
      
      if (isMounted.current) {
        setIsVideoReady(true);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Play request was interrupted');
      } else {
        console.error('Error playing video:', error);
        if (isMounted.current) {
          setCameraError('Gagal memutar video kamera');
        }
      }
    }
  };

  const getCameraDevices = async () => {
    try {
      setCameraError(null);
      
      if (!navigator.mediaDevices?.enumerateDevices) {
        setCameraError("Browser tidak mendukung enumerasi perangkat");
        return null;
      }
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (isMounted.current) {
        setCameraDevices(videoDevices);
      }
      
      // Cari kamera depan
      let frontCamera = videoDevices.find(d => 
        d.label.toLowerCase().includes('front') || 
        d.label.toLowerCase().includes('user') ||
        d.label.toLowerCase().includes('face')
      );
      
      if (!frontCamera && videoDevices.length > 0) {
        frontCamera = videoDevices[0];
      }
      
      if (frontCamera) {
        if (isMounted.current) {
          setSelectedCameraId(frontCamera.deviceId);
          setCurrentCameraMode("front");
        }
        return frontCamera.deviceId;
      }
      
      return null;
      
    } catch (error) {
      console.error("Error mendapatkan daftar kamera:", error);
      return null;
    }
  };

  const startCameraWithDevice = async (deviceId = null) => {
    try {
      if (!isMounted.current) return null;
      
      setIsLoading(true);
      setCameraError(null);
      setIsVideoReady(false);
      
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Browser tidak mendukung akses kamera.");
        setIsLoading(false);
        return null;
      }
      
      stopCamera();
      
      const constraints = {
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: currentCameraMode === "front" ? "user" : "environment"
        },
        audio: false
      };
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!isMounted.current) {
        newStream.getTracks().forEach(track => track.stop());
        return null;
      }
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await playVideo(videoRef.current);
      }
      
      setIsLoading(false);
      return newStream;
      
    } catch (error) {
      console.error("Error mengakses kamera:", error);
      if (isMounted.current) {
        setCameraError("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.");
      }
      setIsLoading(false);
      return null;
    }
  };

  const startCamera = async () => {
    const deviceId = await getCameraDevices();
    await startCameraWithDevice(deviceId);
  };

  const switchCamera = async () => {
    if (cameraDevices.length < 2) {
      alert("Hanya ditemukan 1 kamera. Tidak bisa mengganti.");
      return;
    }
    
    setIsSwitchingCamera(true);
    
    try {
      const newMode = currentCameraMode === "front" ? "back" : "front";
      setCurrentCameraMode(newMode);
      await startCameraWithDevice();
    } catch (error) {
      console.error("Error mengganti kamera:", error);
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  // Inisialisasi peta Leaflet
  const initMap = (lat, lon) => {
    if (!window.L || mapInstanceRef.current) return;
    
    try {
      // Hapus map lama jika ada
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Hapus container lama jika ada
      const oldContainer = document.getElementById('hidden-map-container');
      if (oldContainer) {
        oldContainer.remove();
      }
      
      // Buat container peta baru
      const mapDiv = document.createElement('div');
      mapDiv.id = 'hidden-map-container';
      mapDiv.style.width = '300px';
      mapDiv.style.height = '300px';
      mapDiv.style.position = 'absolute';
      mapDiv.style.top = '-9999px';
      mapDiv.style.left = '-9999px';
      mapDiv.style.zIndex = '-9999';
      document.body.appendChild(mapDiv);
      
      // Buat map
      const newMap = window.L.map(mapDiv, { 
        attributionControl: false, 
        zoomControl: false 
      }).setView([lat, lon], 18);
      
      // Tambah tile layer satelit
      window.L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Google Satellite'
      }).addTo(newMap);
      
      // Tambah marker
      window.L.marker([lat, lon]).addTo(newMap);
      
      // Simpan referensi
      mapInstanceRef.current = newMap;
      
      // Tunggu map selesai render
      setTimeout(() => {
        if (isMounted.current) {
          setIsMapReady(true);
          console.log('✅ Map ready');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error init map:', error);
    }
  };

  // ============= FUNGSI EKSTRAK DATA LOKASI =============
  const extractLocationDetails = (alamatArray) => {
    if (!alamatArray || alamatArray.length === 0) {
      return {
        kecamatan: "-",
        kabupaten: "-",
        provinsi: "-",
        negara: "-",
        jalan: "-",
        koordinat: "-"
      };
    }

    let kecamatan = "-";
    let kabupaten = "-";
    let provinsi = "-";
    let negara = "-";
    let jalan = "-";
    let koordinat = "-";

    alamatArray.forEach(line => {
      if (line.includes("Kecamatan:")) {
        kecamatan = line.replace("Kecamatan:", "").trim();
      } else if (line.includes("Kabupaten:")) {
        kabupaten = line.replace("Kabupaten:", "").trim();
      } else if (line.includes("Provinsi:")) {
        provinsi = line.replace("Provinsi:", "").trim();
      } else if (line.includes("Negara:")) {
        negara = line.replace("Negara:", "").trim();
      } else if (line.includes("Jalan:")) {
        jalan = line.replace("Jalan:", "").trim();
      } else if (line.includes("Koordinat:")) {
        koordinat = line.replace("Koordinat:", "").trim();
      }
    });

    return { kecamatan, kabupaten, provinsi, negara, jalan, koordinat };
  };

  // ============= FUNGSI RENDER MAP KE CANVAS =============
  const renderMapToCanvas = () => {
    return new Promise((resolve) => {
      if (!mapInstanceRef.current || !window.leafletImage) {
        console.log('Map or leafletImage not ready');
        resolve(null);
        return;
      }
      
      try {
        window.leafletImage(mapInstanceRef.current, (err, mapCanvas) => {
          if (err) {
            console.error('Gagal render peta:', err);
            resolve(null);
          } else {
            resolve(mapCanvas);
          }
        });
      } catch (error) {
        console.error('Error rendering map:', error);
        resolve(null);
      }
    });
  };

  // ============= FUNGSI AMBIL FOTO DENGAN PETA SATELIT =============
  const ambilFotoDenganLokasi = async () => {
    if (!videoRef.current || !canvasRef.current) {
      alert("Kamera tidak tersedia");
      return;
    }
    
    if (!stream || !isVideoReady) {
      alert("Stream kamera belum siap");
      return;
    }

    if (!locationData || !locationData.alamat || locationData.alamat.length === 0) {
      alert("Data lokasi belum tersedia");
      return;
    }

    if (!mapInstanceRef.current || !window.leafletImage) {
      alert("Peta satelit belum siap");
      return;
    }
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      // Set ukuran canvas
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Gambar video
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Render peta
      const mapCanvas = await renderMapToCanvas();
      
      if (mapCanvas) {
        // Tempelkan peta di pojok kanan bawah
        const mapSize = 150;
        const rightMargin = 15;
        const bottomMargin = 15;
        
        ctx.drawImage(
          mapCanvas, 
          canvas.width - mapSize - rightMargin, 
          canvas.height - mapSize - bottomMargin, 
          mapSize, 
          mapSize
        );
        
        // Border putih
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeRect(
          canvas.width - mapSize - rightMargin, 
          canvas.height - mapSize - bottomMargin, 
          mapSize, 
          mapSize
        );
      }

      // ===== OVERLAY TEKS DI KIRI BAWAH =====
      const locationDetails = extractLocationDetails(locationData.alamat);
      
      // Waktu
      const now = new Date();
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const dayName = days[now.getDay()];
      
      const date = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      
      let hour = now.getHours();
      const minute = now.getMinutes().toString().padStart(2, '0');
      const second = now.getSeconds().toString().padStart(2, '0');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      
      // Shadow untuk teks
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      const leftMargin = 15;
      const bottomMargin_ = 20;
      let yPos = canvas.height - bottomMargin_ - 85;
      
      // Baris 1: Lokasi
      ctx.font = "bold 14px Arial, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      
      let locationText = `${locationDetails.kecamatan}, ${locationDetails.kabupaten}, ${locationDetails.provinsi}`;
      if (locationDetails.kecamatan === "-") {
        locationText = locationData.alamat[0] || "Indonesia";
      }
      ctx.fillText(locationText, leftMargin, yPos);
      
      // Baris 2: Jalan
      yPos += 20;
      ctx.font = "12px Arial, sans-serif";
      let jalanText = locationDetails.jalan;
      if (jalanText === "-") {
        jalanText = locationData.alamat[1] || "";
      }
      if (jalanText.length > 50) {
        jalanText = jalanText.substring(0, 47) + "...";
      }
      ctx.fillText(jalanText, leftMargin, yPos);
      
      // Baris 3: Koordinat
      yPos += 17;
      ctx.font = "11px Arial, sans-serif";
      ctx.fillStyle = "#FFD700";
      
      let coordText = locationDetails.koordinat;
      if (coordText === "-" && locationData.coords) {
        coordText = `Lat ${locationData.coords.lat.toFixed(6)}° Lon ${locationData.coords.lon.toFixed(6)}°`;
      }
      ctx.fillText(coordText, leftMargin, yPos);
      
      // Baris 4: Tanggal
      yPos += 17;
      ctx.font = "bold 11px Arial, sans-serif";
      ctx.fillStyle = "#4CAF50";
      
      const waktuFormat = `${dayName}, ${date}/${month}/${year} ${hour}:${minute}:${second} ${ampm}`;
      ctx.fillText(waktuFormat, leftMargin, yPos);
      
      // Baris 5: Status
      yPos += 17;
      ctx.font = "bold 12px Arial, sans-serif";
      ctx.fillStyle = type === "masuk" ? "#4CAF50" : "#FF9800";
      
      const statusText = `${type === "masuk" ? "CHECK IN" : "CHECK OUT"} - ${locationData.user?.nama || "Karyawan"}`;
      ctx.fillText(statusText, leftMargin, yPos);
      
      // Hapus shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      
      // Konversi ke data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setFoto(dataUrl);
      
      if (onCapture) {
        onCapture(dataUrl);
      }
      
      stopCamera();
      
    } catch (error) {
      console.error("Error mengambil foto:", error);
      alert("Gagal mengambil foto. Silakan coba lagi.");
    }
  };

  const handleRetake = () => {
    setFoto(null);
    setCameraError(null);
    setIsVideoReady(false);
    
    if (onCapture) {
      onCapture(null);
    }
    
    setTimeout(() => {
      if (isMounted.current) {
        startCameraWithDevice(selectedCameraId);
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-slate-700">
          {type === "masuk" ? "Check In" : "Check Out"}
        </h3>
        <p className="text-sm text-slate-500">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })} • {new Date().toLocaleTimeString("id-ID")}
        </p>
      </div>

      {!foto ? (
        <>
          {/* Camera Controls */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-slate-600">
              Kamera: <span className="font-medium">
                {currentCameraMode === "front" ? "Depan" : "Belakang"}
              </span>
            </div>
            {cameraDevices.length > 1 && (
              <button
                onClick={switchCamera}
                disabled={isSwitchingCamera || isLoading}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
              >
                <RefreshCw size={14} className={isSwitchingCamera ? "animate-spin" : ""} />
                Ganti Kamera
              </button>
            )}
          </div>

          {/* Video Preview */}
          <div className="relative bg-slate-100 rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full aspect-video object-cover"
            />
            
            {/* Loading State */}
            {(isLoading || !isVideoReady) && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">
                    {isLoading ? "Menyiapkan kamera..." : "Memuat video..."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center p-4">
                  <p className="text-sm mb-2">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            )}
            
            {/* Map Ready Indicator */}
            {isMapReady && isVideoReady && (
              <div className="absolute bottom-2 right-2 w-16 h-16 bg-green-500/80 rounded-lg flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                Peta Siap
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
          
          {/* Tombol Ambil Foto */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={ambilFotoDenganLokasi}
              disabled={
                !isVideoReady || 
                isLoading || 
                cameraError || 
                !locationData?.alamat?.length ||
                !isMapReady
              }
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm text-white font-medium ${
                isVideoReady && !isLoading && !cameraError && locationData?.alamat?.length > 0 && isMapReady
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                  : "bg-slate-400 cursor-not-allowed"
              }`}
            >
              <Camera size={18} /> 
              {isMapReady ? "Ambil Foto + Peta" : "Menyiapkan Peta..."}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Foto Preview */}
          <div className="relative bg-slate-100 rounded-lg overflow-hidden">
            <img 
              src={foto} 
              alt="Preview" 
              className="w-full aspect-video object-cover"
            />
          </div>
          
          <p className="mt-2 text-xs text-center text-green-600">
            Foto dengan peta berhasil diambil
          </p>
        </>
      )}

      {/* Tombol Aksi */}
      <div className="mt-6 flex justify-between gap-3">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
        >
          Batal
        </button>
        
        {foto && (
          <button
            onClick={handleRetake}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
          >
            Ambil Ulang
          </button>
        )}
      </div>
    </div>
  );
}