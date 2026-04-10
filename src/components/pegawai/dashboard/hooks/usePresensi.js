"use client";

import { useState, useEffect } from "react";
import { presensiAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export function usePresensi(user) {
  const [presensiHariIni, setPresensiHariIni] = useState({
    masuk: null,
    pulang: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    fetchPresensiHariIni();
  }, [user]);

  const fetchPresensiHariIni = async () => {
    try {
      const response = await presensiAPI.getHariIni();
      
      if (response.data?.data) {
        const data = response.data.data;
        setPresensiHariIni({
          masuk: data.jam_masuk || data.masuk,
          pulang: data.jam_pulang || data.pulang
        });
      }
    } catch (err) {
      console.error("Error fetch presensi:", err);
      // Fallback to riwayat
      await fetchPresensiFromRiwayat();
    }
  };

  const fetchPresensiFromRiwayat = async () => {
    try {
      const today = new Date();
      const bulan = today.getMonth() + 1;
      const tahun = today.getFullYear();
      
      const response = await presensiAPI.getRiwayat(bulan, tahun);
      const data = response.data?.data || response.data;
      
      if (Array.isArray(data)) {
        const todayStr = today.toISOString().split('T')[0];
        const todayPresensi = data.find(p => 
          p.tanggal?.split('T')[0] === todayStr
        );
        
        if (todayPresensi) {
          setPresensiHariIni({
            masuk: todayPresensi.jam_masuk,
            pulang: todayPresensi.jam_pulang
          });
        }
      }
    } catch (error) {
      console.error("Fallback presensi gagal:", error);
    }
  };

  const submitPresensi = async (type, data) => {
    setIsLoading(true);
    try {
      let response;
      const payload = {
        user_id: user.id,
        ...data
      };

      if (type === "masuk") {
        response = await presensiAPI.masuk(payload);
      } else {
        response = await presensiAPI.pulang(payload);
      }

      await fetchPresensiHariIni();
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Gagal absen:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusKehadiran = () => {
    if (!presensiHariIni.masuk) return "Belum Absen";
    if (!presensiHariIni.pulang) return "Sedang Bekerja";
    return "Selesai Bekerja";
  };

  return {
    presensiHariIni,
    isLoading,
    submitPresensi,
    getStatusKehadiran,
    refreshPresensi: fetchPresensiHariIni
  };
}