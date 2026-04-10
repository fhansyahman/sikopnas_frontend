"use client";

import { User } from "lucide-react";

export function UserHeader({ userData }) {
  return (
    <div className="bg-slate-800 text-white py-8 shadow-lg">
      <div className="flex flex-col items-center justify-center text-center px-4">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border-4 border-white/20 shadow-lg mb-4 overflow-hidden">
          {userData?.foto ? (
            <img 
              src={userData.foto} 
              alt="Foto Profil"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={48} className="text-white/90" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {userData?.nama || "Loading..."}
        </h1>
        <div className="bg-slate-700/50 px-4 py-1.5 rounded-full">
          <p className="text-sm font-medium text-slate-200">
            {userData?.jabatan || "Staff Lapangan"}
          </p>
        </div>
      </div>
    </div>
  );
}