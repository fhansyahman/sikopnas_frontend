"use client";

import { User, RefreshCw } from "lucide-react";

export function EmptyState({ error, onRetry }) {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw size={16} />
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
        <User className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500">Tidak ada data pengguna ditemukan</p>
    </div>
  );
}