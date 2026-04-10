"use client";

import { CalendarClock, Filter } from "lucide-react";

export function EmptyState({ type, onRefresh, onSetToday }) {
  if (type === "empty") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <CalendarClock className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">
          Belum ada pengajuan izin
        </p>
        <button
          onClick={onRefresh}
          className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
        >
          Muat Ulang Data
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
        <Filter className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500">
        Tidak ada data izin yang sesuai dengan filter
      </p>
      <button
        onClick={onSetToday}
        className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
      >
        Tampilkan data hari ini
      </button>
    </div>
  );
}