"use client";

import { BarChart3, Plus, RefreshCw } from "lucide-react";

export function EmptyState({ hasSearch, onNewRequest, onRefresh }) {
  return (
    <div className="text-center py-12">
      <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-600 mb-2">
        {hasSearch ? "Tidak ada kinerja yang sesuai dengan pencarian" : "Belum ada laporan kinerja"}
      </h3>
      <p className="text-slate-500">
        {hasSearch 
          ? "Coba sesuaikan kriteria pencarian Anda." 
          : "Mulai dengan membuat laporan kinerja pertama Anda."
        }
      </p>
      <div className="flex items-center justify-center space-x-4 mt-6">
        {!hasSearch && (
          <button
            onClick={onNewRequest}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Buat Laporan Pertama
          </button>
        )}
        <button
          onClick={onRefresh}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Muat Ulang
        </button>
      </div>
    </div>
  );
}