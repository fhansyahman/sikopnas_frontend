"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Konfirmasi",
  confirmColor = "blue" 
}) {
  if (!isOpen) return null;

  const colors = {
    blue: {
      bg: "from-blue-600 to-cyan-600",
      hover: "from-blue-700 to-cyan-700",
      icon: <AlertTriangle className="w-12 h-12 text-blue-600" />
    },
    green: {
      bg: "from-green-600 to-emerald-600",
      hover: "from-green-700 to-emerald-700",
      icon: <CheckCircle className="w-12 h-12 text-green-600" />
    },
    red: {
      bg: "from-red-600 to-rose-600",
      hover: "from-red-700 to-rose-700",
      icon: <XCircle className="w-12 h-12 text-red-600" />
    }
  };

  const color = colors[confirmColor] || colors.blue;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            {color.icon}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${color.bg} text-white rounded-lg text-sm font-medium hover:from-${color.hover} transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}