"use client";

export function EmptyState({ type, onRefresh, onSetCurrentMonth }) {
  if (type === "empty") {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 text-4xl mb-2">📅</div>
        <p className="text-gray-500">Belum ada data presensi.</p>
        <button
          onClick={onRefresh}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Muat Ulang Data
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <div className="text-gray-400 text-4xl mb-2">🔍</div>
      <p className="text-gray-500">
        Tidak ada data presensi untuk filter yang dipilih.
      </p>
      <button
        onClick={onSetCurrentMonth}
        className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Lihat Bulan Ini
      </button>
    </div>
  );
}