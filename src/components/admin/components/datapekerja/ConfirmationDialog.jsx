"use client";

import { AlertTriangle, X, Loader2 } from "lucide-react";

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  type = "warning",
  isLoading = false
}) {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
      confirmButton: "bg-yellow-600 hover:bg-yellow-700",
      confirmButtonDisabled: "bg-yellow-300",
      bgColor: "bg-yellow-100"
    },
    danger: {
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      confirmButton: "bg-red-600 hover:bg-red-700",
      confirmButtonDisabled: "bg-red-300",
      bgColor: "bg-red-100"
    },
    info: {
      icon: <AlertTriangle className="w-12 h-12 text-blue-500" />,
      confirmButton: "bg-blue-600 hover:bg-blue-700",
      confirmButtonDisabled: "bg-blue-300",
      bgColor: "bg-blue-100"
    }
  };

  const config = typeConfig[type] || typeConfig.warning;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mb-4`}>
              {config.icon}
            </div>
            
            <p className="text-gray-700 mb-6">{message}</p>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  isLoading ? config.confirmButtonDisabled : config.confirmButton
                } disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}