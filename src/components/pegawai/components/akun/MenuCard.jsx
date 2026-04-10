"use client";

import { Lock, FileText, Shield, Power } from "lucide-react";

export function MenuCard({ onPasswordClick, onTermsClick, onPrivacyClick, onLogoutClick }) {
  return (
    <div className="mx-6 mt-6 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          <MenuItem 
            icon={<Lock className="text-blue-600" size={20} />}
            label="Ganti Password"
            onClick={onPasswordClick}
            iconBg="bg-blue-50"
          />

          <MenuItem 
            icon={<FileText className="text-blue-600" size={20} />}
            label="Ketentuan Layanan"
            onClick={onTermsClick}
            iconBg="bg-blue-50"
          />

          <MenuItem 
            icon={<Shield className="text-blue-600" size={20} />}
            label="Kebijakan Privasi"
            onClick={onPrivacyClick}
            iconBg="bg-blue-50"
          />

          <MenuItem 
            icon={<Power className="text-red-600" size={20} />}
            label="Logout"
            onClick={onLogoutClick}
            iconBg="bg-red-50"
            textColor="text-red-600"
            isLast
          />
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick, iconBg, textColor = "text-slate-800", isLast = false }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors duration-200 ${
        isLast ? '' : 'border-b border-slate-100'
      }`}
    >
      <div className={`${iconBg} p-2.5 rounded-lg`}>
        {icon}
      </div>
      <span className={`font-medium ${textColor}`}>{label}</span>
    </button>
  );
}