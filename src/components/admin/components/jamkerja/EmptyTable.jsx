"use client";

import { Clock } from "lucide-react";

export function EmptyTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">Tidak ada data jam kerja ditemukan</p>
      </div>
    </div>
  );
}