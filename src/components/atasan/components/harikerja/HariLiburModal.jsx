"use client";

import { X, Save, Calendar, CalendarDays } from "lucide-react";

export function HariLiburModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit, tahunOptions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Hari Libur' : 'Tambah Hari Libur'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <DateInput
              value={formData.tanggal}
              onChange={(value) => setFormData({...formData, tanggal: value})}
            />

            <TextInput
              value={formData.nama_libur}
              onChange={(value) => setFormData({...formData, nama_libur: value})}
              placeholder="Masukkan nama hari libur"
              label="Nama Libur"
              required
            />

            <JenisSelector
              isTahunan={formData.is_tahunan}
              onChange={(value) => setFormData({...formData, is_tahunan: value})}
            />

            {!formData.is_tahunan && (
              <TahunSelector
                value={formData.tahun}
                onChange={(value) => setFormData({...formData, tahun: value})}
                tahunOptions={tahunOptions}
              />
            )}
          </div>

          <FormActions onClose={onClose} isEdit={isEdit} />
        </form>
      </div>
    </div>
  );
}

function DateInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tanggal <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        required
      />
    </div>
  );
}

function TextInput({ value, onChange, placeholder, label, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        required={required}
      />
    </div>
  );
}

function JenisSelector({ isTahunan, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Jenis Libur
      </label>
      <div className="grid grid-cols-2 gap-3">
        <JenisButton
          active={!isTahunan}
          onClick={() => onChange(false)}
          icon={<Calendar size={14} className="text-blue-600" />}
          label="Sekali"
          activeColor="bg-blue-50 border-blue-200 text-blue-700"
          inactiveColor="bg-white border-gray-300 text-gray-700"
        />
        <JenisButton
          active={isTahunan}
          onClick={() => onChange(true)}
          icon={<CalendarDays size={14} className="text-purple-600" />}
          label="Tahunan"
          activeColor="bg-purple-50 border-purple-200 text-purple-700"
          inactiveColor="bg-white border-gray-300 text-gray-700"
        />
      </div>
    </div>
  );
}

function JenisButton({ active, onClick, icon, label, activeColor, inactiveColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-lg border transition-colors ${
        active ? activeColor : inactiveColor
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded flex items-center justify-center ${
          active ? 'bg-white/50' : 'bg-gray-100'
        }`}>
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </button>
  );
}

function TahunSelector({ value, onChange, tahunOptions }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tahun
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      >
        {tahunOptions.map(tahun => (
          <option key={tahun} value={tahun}>{tahun}</option>
        ))}
      </select>
    </div>
  );
}

function FormActions({ onClose, isEdit }) {
  return (
    <div className="mt-8 flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        Batalkan
      </button>
      <button
        type="submit"
        className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-violet-700 flex items-center gap-2"
      >
        <Save size={16} />
        {isEdit ? 'Update Data' : 'Simpan Data'}
      </button>
    </div>
  );
}