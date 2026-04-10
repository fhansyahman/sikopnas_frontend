"use client";

import { FileText, Plus, RefreshCw } from "lucide-react";

export function EmptyState({ isFilterActive, onNewRequest, onRefresh }) {
  return (
    <div className="text-center py-12">
      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-base font-medium text-gray-600 mb-2">
        {isFilterActive ? "Tidak ada data sesuai filter" : "Belum ada pengajuan izin"}
      </h3>
      <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
        {isFilterActive 
          ? "Coba ubah kriteria filter atau hapus filter untuk melihat semua data" 
          : "Mulai dengan mengajukan izin pertama Anda menggunakan tombol di atas"
        }
      </p>
      <div className="flex items-center justify-center space-x-4">
        {!isFilterActive && (
          <button
            onClick={onNewRequest}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Ajukan Izin Pertama
          </button>
        )}
        <button
          onClick={onRefresh}
          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Muat Ulang
        </button>
      </div>
    </div>
  );
}