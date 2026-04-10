"use client";

import { useState } from "react";
import { ClipboardCheck, Loader2, Check, X } from "lucide-react";

export function BulkActionBar({ 
  selectedCount, 
  onBulkAction, 
  onClearSelection,
  isProcessing 
}) {
  const [bulkAction, setBulkAction] = useState('');

  const handleApply = () => {
    if (bulkAction) {
      onBulkAction(bulkAction);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg border border-blue-200 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800">
              {selectedCount} izin dipilih
            </p>
            <p className="text-xs text-blue-600">
              Pilih aksi untuk izin yang dipilih
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="px-4 py-2.5 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
            disabled={isProcessing}
          >
            <option value="">Pilih Aksi</option>
            <option value="Disetujui">Setujui Semua</option>
            <option value="Ditolak">Tolak Semua</option>
          </select>
          
          <button
            onClick={handleApply}
            disabled={!bulkAction || isProcessing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Check size={16} />
                Terapkan Aksi
              </>
            )}
          </button>
          
          <button
            onClick={onClearSelection}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            <X size={16} />
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}