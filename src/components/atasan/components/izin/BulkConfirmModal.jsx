"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

export function BulkConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  action, 
  count,
  isProcessing 
}) {
  if (!isOpen) return null;

  const actionText = action === 'Disetujui' ? 'menyetujui' : 'menolak';
  const color = action === 'Disetujui' ? 'green' : 'red';
  
  const colors = {
    green: {
      bg: "from-green-600 to-emerald-600",
      hover: "from-green-700 to-emerald-700",
      icon: "text-green-600"
    },
    red: {
      bg: "from-red-600 to-rose-600",
      hover: "from-red-700 to-rose-700",
      icon: "text-red-600"
    }
  };

  const colorConfig = colors[color] || colors.green;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <AlertTriangle className={`w-12 h-12 ${colorConfig.icon}`} />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {action === 'Disetujui' ? 'Setujui' : 'Tolak'} {count} Izin?
          </h2>
          
          <p className="text-gray-600 mb-6">
            Yakin ingin {actionText} {count} pengajuan izin?
          </p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${colorConfig.bg} text-white rounded-lg text-sm font-medium hover:${colorConfig.hover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                `Ya, ${action === 'Disetujui' ? 'Setujui' : 'Tolak'}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}