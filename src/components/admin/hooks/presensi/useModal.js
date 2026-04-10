"use client";

import { useState, useCallback } from "react";

export function useModal() {
  const [modalState, setModalState] = useState({
    detail: false,
    edit: false,
    foto: false,
    confirm: false
  });
  
  const [selectedPresensi, setSelectedPresensi] = useState(null);
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const openDetailModal = useCallback((presensi) => {
    setSelectedPresensi(presensi);
    setModalState(prev => ({ ...prev, detail: true }));
  }, []);

  const closeDetailModal = useCallback(() => {
    setModalState(prev => ({ ...prev, detail: false }));
    setSelectedPresensi(null);
  }, []);

  const openEditModal = useCallback((presensi) => {
    setSelectedPresensi(presensi);
    setModalState(prev => ({ ...prev, edit: true }));
  }, []);

  const closeEditModal = useCallback(() => {
    setModalState(prev => ({ ...prev, edit: false }));
    setSelectedPresensi(null);
  }, []);

  const openFotoModal = useCallback((foto, jenis, presensi) => {
    setSelectedFoto({ src: foto, jenis });
    setSelectedPresensi(presensi);
    setModalState(prev => ({ ...prev, foto: true }));
  }, []);

  const closeFotoModal = useCallback(() => {
    setModalState(prev => ({ ...prev, foto: false }));
    setSelectedFoto(null);
  }, []);

  const openConfirmDialog = useCallback((data) => {
    setConfirmData(data);
    setModalState(prev => ({ ...prev, confirm: true }));
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setModalState(prev => ({ ...prev, confirm: false }));
    setConfirmData(null);
  }, []);

  return {
    modalState,
    selectedPresensi,
    selectedFoto,
    confirmData,
    openDetailModal,
    closeDetailModal,
    openEditModal,
    closeEditModal,
    openFotoModal,
    closeFotoModal,
    openConfirmDialog,
    closeConfirmDialog
  };
}