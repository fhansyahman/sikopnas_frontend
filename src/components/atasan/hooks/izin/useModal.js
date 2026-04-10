"use client";

import { useState, useCallback } from "react";

export function useModal() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null
  });

  const openDetailModal = useCallback((izin) => {
    setModalState({
      isOpen: true,
      type: 'detail',
      data: izin
    });
  }, []);

  const openConfirmModal = useCallback((type, data) => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      data
    });
  }, []);

  const openBulkModal = useCallback((action, items) => {
    setModalState({
      isOpen: true,
      type: 'bulk',
      data: { action, items }
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      type: null,
      data: null
    });
  }, []);

  return {
    modalState,
    openDetailModal,
    openConfirmModal,
    openBulkModal,
    closeDetailModal: closeModal,
    closeConfirmModal: closeModal,
    closeBulkModal: closeModal
  };
}