"use client";

import { ArrowLeft, ClipboardList, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
export function Header({ onBack, onRefresh, isLoading }) {
  const router = useRouter();
  return (
    <div className="w-full bg-gradient-to-b from-slate-700 to-slate-600 text-white">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
             onClick={() => router.push("/pegawai/dashboard")}
              className="p-2 rounded-full hover:bg-gray-700 transition flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Pengajuan Izin</h1>
              <p className="text-slate-300 mt-1 text-sm">Kelola pengajuan cuti dan izin</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-slate-500 transition flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="bg-slate-500/30 rounded-full p-2">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}