"use client";

import { Power } from "lucide-react";
import { ModalWrapper } from "./ModalWrapper";

export function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <ModalWrapper onClose={onClose} size="sm">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Power className="text-red-600" size={32} />
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 text-center mb-2">
          Konfirmasi Logout
        </h2>
        
        <p className="text-slate-600 text-center mb-6">
          Apakah Anda yakin ingin logout dari aplikasi?
        </p>
        
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}