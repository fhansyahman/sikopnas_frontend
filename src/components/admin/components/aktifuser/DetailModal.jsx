"use client";

import { X, Shield, UserMinus, UserPlus2 } from "lucide-react";

export function DetailModal({
  user,
  onClose,
  onActivate,
  onDeactivate,
  formatDateTime,
  getStatusBadge,
  getAktivasiBadge
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <ModalHeader user={user} onClose={onClose} />
        
        <div className="p-6">
          <UserInfoGrid
            user={user}
            formatDateTime={formatDateTime}
            getStatusBadge={getStatusBadge}
            getAktivasiBadge={getAktivasiBadge}
          />
          
          <PersonalInfo user={user} />
          
          <ModalActions
            user={user}
            onClose={onClose}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        </div>
      </div>
    </div>
  );
}

function ModalHeader({ user, onClose }) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Detail Pegawai</h2>
        <p className="text-sm text-blue-600">{user.nama}</p>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X size={20} className="text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}

function UserInfoGrid({ user, formatDateTime, getStatusBadge, getAktivasiBadge }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <InfoCard
        title="Informasi Dasar"
        items={[
          { label: "Tanggal Bergabung", value: formatDateTime(user.created_at) },
          { label: "Nama", value: user.nama },
          { label: "Username", value: `@${user.username}` },
          { label: "ID", value: user.id, type: "id" },
          { label: "Jabatan", value: user.jabatan },
          { label: "Wilayah Penugasan", value: user.wilayah_penugasan || '-' },
        ]}
      />
      
      <StatusCard
        user={user}
        getStatusBadge={getStatusBadge}
        getAktivasiBadge={getAktivasiBadge}
      />
    </div>
  );
}

function InfoCard({ title, items }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="space-y-3">
        {items.map((item, index) => (
          <InfoItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

function InfoItem({ label, value, type }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <p className={`text-gray-900 font-medium ${type === 'id' ? 'text-xs text-blue-600' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function StatusCard({ user, getStatusBadge, getAktivasiBadge }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Shield size={18} />
        Status & Aktivasi
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <StatusBox
            label="Status"
            badge={getStatusBadge(user.status, user.is_active).element}
          />
          <StatusBox
            label="Aktivasi Sistem"
            badge={getAktivasiBadge(user.is_active).element}
          />
        </div>
        <RoleBox role={user.roles} />
      </div>
    </div>
  );
}

function StatusBox({ label, badge }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100">
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <div className="mt-1">{badge}</div>
    </div>
  );
}

function RoleBox({ role }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100">
      <label className="block text-xs text-gray-600 mb-1">Role</label>
      <p className="font-semibold text-gray-800 capitalize">{role}</p>
    </div>
  );
}

function PersonalInfo({ user }) {
  const personalInfoItems = [
    { label: "Jenis Kelamin", value: user.jenis_kelamin || '-' },
    { label: "No. HP", value: user.no_hp || '-' },
    { label: "Tempat Lahir", value: user.tempat_lahir || '-' },
    { 
      label: "Tanggal Lahir", 
      value: user.tanggal_lahir 
        ? new Date(user.tanggal_lahir).toLocaleDateString('id-ID')
        : '-' 
    },
    { label: "Alamat", value: user.alamat || '-', fullWidth: true },
    { label: "Pendidikan Terakhir", value: user.pendidikan_terakhir || '-' },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-5 mb-8">
      <h4 className="font-semibold text-gray-900 mb-3">Informasi Pribadi</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalInfoItems.map((item, index) => (
          <PersonalInfoItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

function PersonalInfoItem({ label, value, fullWidth }) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}

function ModalActions({ user, onClose, onActivate, onDeactivate }) {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
      <button
        onClick={onClose}
        className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        Tutup
      </button>
      
      {user.is_active ? (
        <ActionButton
          onClick={() => onDeactivate(user)}
          icon={<UserMinus size={16} />}
          label="Nonaktifkan"
          bgColor="from-red-600 to-rose-600"
          hoverColor="from-red-700 to-rose-700"
        />
      ) : (
        <ActionButton
          onClick={() => onActivate(user)}
          icon={<UserPlus2 size={16} />}
          label="Aktifkan"
          bgColor="from-green-600 to-emerald-600"
          hoverColor="from-green-700 to-emerald-700"
        />
      )}
    </div>
  );
}

function ActionButton({ onClick, icon, label, bgColor, hoverColor }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 bg-gradient-to-r ${bgColor} text-white rounded-lg text-sm font-medium hover:bg-gradient-to-r ${hoverColor} flex items-center gap-2`}
    >
      {icon}
      {label}
    </button>
  );
}