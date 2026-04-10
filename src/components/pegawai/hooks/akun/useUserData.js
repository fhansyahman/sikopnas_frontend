"use client";

import { useState, useEffect } from "react";
import { authAPI } from "@/lib/api";

export function useUserData() {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        console.log("🔄 Mengambil data user untuk halaman akun...");
        
        const response = await authAPI.getProfile();
        console.log("✅ Response user di akun page:", response);
        
        // PERBAIKAN: Ambil data dari response.data.data
        if (response.data && response.data.data) {
          const userData = response.data.data;
          console.log("👤 Data user di akun page:", userData);
          setUserData(userData);
          // Simpan ke localStorage untuk konsistensi
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (response.data) {
          // Fallback jika struktur berbeda
          console.log("⚠️ Struktur data berbeda di akun page, menggunakan response.data langsung");
          setUserData(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("❌ Error fetching user data di akun page:", error);
        
        // Fallback ke localStorage
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user');
          if (userData) {
            console.log("🔄 Menggunakan data user dari localStorage di akun page");
            setUserData(JSON.parse(userData));
          }
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loadingUser };
}