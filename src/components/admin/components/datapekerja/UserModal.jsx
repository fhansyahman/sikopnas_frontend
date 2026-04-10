"use client";

import { X, User, Shield, Briefcase, Database } from "lucide-react";

export function UserModal({ isOpen, onClose, formData, setFormData, editingUser, onSubmit, onFileChange }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Section title="Informasi Pribadi" icon={<User size={18} />} color="blue">
              <Input
                label="Nama Lengkap *"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Jenis Kelamin"
                  value={formData.jenis_kelamin}
                  onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                  options={[
                    { value: "", label: "Pilih" },
                    { value: "Laki-laki", label: "Laki-laki" },
                    { value: "Perempuan", label: "Perempuan" }
                  ]}
                />
                
                <Input
                  label="Tanggal Lahir"
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
                />
              </div>

              <Input
                label="Tempat Lahir"
                value={formData.tempat_lahir}
                onChange={(e) => setFormData({...formData, tempat_lahir: e.target.value})}
              />

              <Textarea
                label="Alamat"
                value={formData.alamat}
                onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                rows={3}
              />
            </Section>

            {/* Login Information */}
            <Section title="Akses Sistem" icon={<Shield size={18} />} color="emerald">
              <Input
                label="Nomor Telepon"
                type="tel"
                value={formData.no_hp}
                onChange={(e) => setFormData({...formData, no_hp: e.target.value})}
              />

              <Input
                label="Telegram ID"
                value={formData.telegram_id}
                onChange={(e) => setFormData({...formData, telegram_id: e.target.value})}
                placeholder="@username"
              />

              <Input
                label="Username *"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />

              <Input
                label={`Password ${!editingUser ? '*' : ''}`}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!editingUser}
                placeholder={editingUser ? "Kosongkan jika tidak diubah" : ""}
              />
            </Section>

            {/* Work Information */}
            <Section title="Pekerjaan & Penugasan" icon={<Briefcase size={18} />} color="amber">
              <Input
                label="Jabatan *"
                value={formData.jabatan}
                onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                required
              />

              <Select
                label="Role Sistem"
                value={formData.roles}
                onChange={(e) => setFormData({...formData, roles: e.target.value})}
                options={[
                  { value: "pegawai", label: "Pegawai" },
                  { value: "atasan", label: "Atasan" },
                  { value: "admin", label: "Admin" }
                ]}
              />

              <Select
                label="Wilayah Penugasan"
                value={formData.wilayah_penugasan}
                onChange={(e) => setFormData({...formData, wilayah_penugasan: e.target.value})}
                options={[
                  { value: "", label: "Pilih Wilayah" },
                  { value: "Cermee", label: "Cermee" },
                  { value: "Prajekan", label: "Prajekan" },
                  { value: "Botolinggo", label: "Botolinggo" },
                  { value: "Klabang", label: "Klabang" },
                  { value: "Ijen", label: "Ijen" }
                ]}
              />

              <Checkbox
                id="is_active"
                label="Aktifkan akun dalam sistem"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
            </Section>

            {/* Additional Information */}
            <Section title="Informasi Tambahan" icon={<Database size={18} />} color="purple">
              <Input
                label="Pendidikan Terakhir"
                value={formData.pendidikan_terakhir}
                onChange={(e) => setFormData({...formData, pendidikan_terakhir: e.target.value})}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg border border-gray-300 overflow-hidden">
                    {formData.foto ? (
                      <img src={formData.foto} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-blue-600 hover:file:bg-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maks: 2MB</p>
                  </div>
                </div>
              </div>

              <Checkbox
                id="can_remote"
                label="Izinkan akses remote"
                checked={formData.can_remote}
                onChange={(e) => setFormData({...formData, can_remote: e.target.checked})}
              />
            </Section>
          </div>

          <FormActions onClose={onClose} isEditing={!!editingUser} />
        </form>
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, icon, color, children }) {
  return (
    <div className="space-y-4">
      <h3 className={`font-semibold text-gray-900 flex items-center gap-2 text-${color}-600`}>
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-sm text-gray-700">{label}</label>
    </div>
  );
}

function FormActions({ onClose, isEditing }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        Batalkan
      </button>
      <button
        type="submit"
        className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700"
      >
        {isEditing ? 'Update Data' : 'Tambahkan ke Sistem'}
      </button>
    </div>
  );
}