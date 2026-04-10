"use client";

import { MapPin, Building, Shield } from "lucide-react";

export function InfoCard({ userData }) {
  return (
    <div className="mx-6 mt-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <InfoItem 
          icon={<MapPin className="text-slate-600" size={20} />}
          label="Penempatan Wilayah"
          value={userData?.wilayah_penugasan || "Prajekan"}
        />

        <InfoItem 
          icon={<Building className="text-slate-600" size={20} />}
          label="UPT Wilayah Prajekan"
          value={userData?.department || "Pengelolaan Jalan dan Jembatan"}
        />

        {userData?.roles && (
          <InfoItem 
            icon={<Shield className="text-slate-600" size={20} />}
            label="Role"
            value={userData.roles}
            capitalize
          />
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, capitalize = false }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-slate-100 p-3 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
        <p className={`text-slate-800 font-medium ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}