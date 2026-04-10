"use client";

import { ClipboardList, Calendar } from "lucide-react";

export function EmptyState({ hasFilters, onSetCurrentMonth }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
        <ClipboardList className="w-8 h-8 text-gray-400" />
      </div>
      
      <p className="text-gray-500">
        {hasFilters 
          ? 'Tidak ada data kinerja yang sesuai dengan filter' 
          : 'Belum ada data kinerja'
        }
      </p>
      
      {!hasFilters && (
        <button
          onClick={onSetCurrentMonth}
          className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm inline-flex items-center gap-2"
        >
          <Calendar size={14} />
          Tampilkan data bulan ini
        </button>
      )}
    </div>
  );
}