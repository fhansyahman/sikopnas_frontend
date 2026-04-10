"use client";

import { ClipboardList, Trash2, X, Loader2 } from "lucide-react";

export function BulkActionBar({
  selectedItems,
  setSelectedItems,
  onBulkDelete,
  isProcessing
}) {
  if (selectedItems.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg border border-blue-200 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800">
              {selectedItems.length} laporan dipilih
            </p>
            <p className="text-xs text-blue-600">
              Pilih aksi untuk laporan yang dipilih
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onBulkDelete}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Hapus Semua
              </>
            )}
          </button>
          
          <button
            onClick={() => setSelectedItems([])}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium w-full md:w-auto"
          >
            <X size={16} />
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}