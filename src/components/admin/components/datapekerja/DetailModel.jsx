"use client";

import { X, User, Phone, Briefcase, Database, MapPin, Calendar, Shield, Key } from "lucide-react";
import { UserPhoto } from "./UserPhoto";

export function DetailModal({ isOpen, onClose, user, onEdit }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Detail Pengguna</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Profile */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="relative inline-block mb-4">
                  <UserPhoto user={user} size="lg" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{user.nama}</h3>
                <p className="text-blue-600 mb-3">{user.jabatan}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <StatusBadge isActive={user.is_active} />
                    <RoleBadge role={user.roles} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoSection title="Informasi Pribadi" icon={<User size={18} />} color="blue">
                  <InfoItem label="Jenis Kelamin" value={user.jenis_kelamin} />
                  <InfoItem 
                    label="Tempat, Tanggal Lahir" 
                    value={`${user.tempat_lahir || '-'}, ${formatDate(user.tanggal_lahir)}`} 
                  />
                  <InfoItem label="Alamat" value={user.alamat} />
                </InfoSection>

                <InfoSection title="Kontak & Akses" icon={<Phone size={18} />} color="emerald">
                  <InfoItem label="Telepon" value={user.no_hp} />
                  <InfoItem label="Telegram ID" value={user.telegram_id} />
                  <InfoItem label="Username" value={user.username} />
                </InfoSection>

                <InfoSection title="Pekerjaan & Penugasan" icon={<Briefcase size={18} />} color="amber">
                  <InfoItem label="Jabatan" value={user.jabatan} />
                  <InfoItem label="Wilayah Penugasan" value={user.wilayah_penugasan} />
                  <InfoItem label="Status Kerja" value={user.status} />
                </InfoSection>

                <InfoSection title="Sistem & Pendidikan" icon={<Database size={18} />} color="purple">
                  <InfoItem label="Pendidikan Terakhir" value={user.pendidikan_terakhir} />
                  <InfoItem 
                    label="Remote Access" 
                    value={user.can_remote ? '✅ Diizinkan' : '❌ Tidak Diizinkan'}
                    valueColor={user.can_remote ? 'text-emerald-600' : 'text-red-600'}
                  />
                </InfoSection>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(user);
              }}
              className="px-5 py-2.5 bg-green-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700"
            >
              Edit Data Pengguna
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {isActive ? '🟢 Aktif' : '⚫ Nonaktif'}
    </span>
  );
}

function RoleBadge({ role }) {
  const roleConfig = {
    admin: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🛡️', label: 'Admin' },
    atasan: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '👔', label: 'Atasan' },
    pegawai: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '👤', label: 'Pegawai' }
  };
  
  const config = roleConfig[role] || roleConfig.pegawai;
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.icon} {config.label}
    </span>
  );
}

function InfoSection({ title, icon, color, children }) {
  return (
    <div className="space-y-3">
      <h4 className={`font-semibold text-gray-900 flex items-center gap-2 text-${color}-600`}>
        {icon}
        {title}
      </h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value, valueColor = "text-gray-900" }) {
  if (!value) return null;
  
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <p className={valueColor}>{value}</p>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('id-ID');
  } catch {
    return dateString;
  }
}