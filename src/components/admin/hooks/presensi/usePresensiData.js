"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { adminPresensiAPI } from "@/lib/api";
import Swal from "sweetalert2";
import { useStatistik } from "./useStatistik";

export function usePresensiData(filters) {
  const [presensiList, setPresensiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState([]);

  const { statistik, calculateStatistik } = useStatistik();

  const loadPresensiData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Default ke hari ini jika tidak ada tanggal
      const today = new Date().toISOString().split("T")[0];

      const params = {
        tanggal: filters.tanggal || today,
      };

      // Optional filter status
      if (filters.status && filters.status !== "") {
        params.status_masuk = filters.status;
      }

      console.log("🔍 Loading presensi:", params);

      // ✅ PAKAI getAll (BUKAN getHariIni)
      const response = await adminPresensiAPI.getAll(params);
      const data = response.data?.data || [];

      console.log("📊 Data:", data.length);

      setAllData(data);

      let filteredData = [...data];

      // 🔧 FILTER WILAYAH (manual)
      if (filters.wilayah && filters.wilayah !== "") {
        filteredData = filteredData.filter(
          (item) => item.wilayah_penugasan === filters.wilayah
        );
      }

      // 🔧 FILTER STATUS (manual biar konsisten)
      if (filters.status && filters.status !== "") {
        filteredData = filteredData.filter((item) => {
          let status = "Tanpa Keterangan";

          if (item.izin_id) status = "Izin";
          else if (item.jam_masuk !== null)
            status = item.status_masuk || "Tanpa Keterangan";

          return status === filters.status;
        });
      }

      setPresensiList(filteredData);
      calculateStatistik(filteredData);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Gagal memuat data presensi");
      setAllData([]);
      setPresensiList([]);
      calculateStatistik([]);
    } finally {
      setLoading(false);
    }
  }, [filters.tanggal, filters.status, filters.wilayah, calculateStatistik]);

  useEffect(() => {
    loadPresensiData();
  }, [loadPresensiData]);

  // 🔍 SEARCH FILTER
  const filteredPresensi = useMemo(() => {
    let data = presensiList;

    if (filters.search && filters.search.trim() !== "") {
      const search = filters.search.toLowerCase();

      data = data.filter(
        (p) =>
          p.nama?.toLowerCase().includes(search) ||
          p.jabatan?.toLowerCase().includes(search) ||
          p.wilayah_penugasan?.toLowerCase().includes(search)
      );
    }

    return data;
  }, [presensiList, filters.search]);

  // ✅ FIX: generateHariIni (bukan generatePresensiOtomatis)
  const handleGenerateHariIni = async () => {
    const result = await Swal.fire({
      title: "Generate Presensi Hari Ini?",
      text: "Sistem akan generate otomatis",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#10B981",
    });

    if (result.isConfirmed) {
      try {
        const response = await adminPresensiAPI.generateHariIni();

        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: response.data.message,
          confirmButtonColor: "#10B981",
        });

        loadPresensiData();
      } catch (error) {
        console.error(error);

        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text:
            error.response?.data?.message ||
            "Gagal generate presensi",
        });
      }
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const updateData = {
        ...formData,
        is_lembur: formData.is_lembur ? 1 : 0,
        jam_lembur: formData.is_lembur ? formData.jam_lembur : null,
      };

      if (updateData.izin_id && updateData.status_masuk !== "Izin") {
        updateData.status_masuk = "Izin";
      }

      if (updateData.status_masuk === "Izin" && !updateData.izin_id) {
        updateData.status_masuk = "Tanpa Keterangan";
      }

      await adminPresensiAPI.update(id, updateData);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diupdate",
      });

      loadPresensiData();
      return true;
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text:
          error.response?.data?.message ||
          "Gagal update presensi",
      });

      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminPresensiAPI.delete(id);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil dihapus",
      });

      loadPresensiData();
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text:
          error.response?.data?.message ||
          "Gagal menghapus data",
      });
    }
  };

  return {
    presensiList,
    allData,
    statistik,
    loading,
    error,
    filteredPresensi,
    loadPresensiData,
    handleGenerateHariIni,
    handleUpdate,
    handleDelete,
  };
}