"use client";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600 mt-4 font-medium">Memuat data kinerja...</p>
        <p className="text-slate-400 text-sm mt-2">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}