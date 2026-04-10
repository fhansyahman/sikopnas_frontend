"use client";

import { X, Save, CheckCircle, AlertCircle } from "lucide-react";

export function HariKerjaModal({ isOpen, onClose, onSubmit, formData, setFormData, isEdit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Hari Kerja' : 'Tambah Hari Kerja'}
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

            <StatusSelector
              value={formData.is_hari_kerja}
              onChange={(value) => setFormData({...formData, is_hari_kerja: value})}
            />

            <TextArea
              value={formData.keterangan}
              onChange={(value) => setFormData({...formData, keterangan: value})}
              placeholder="Masukkan keterangan (opsional)"
            />
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

function StatusSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Status Hari
      </label>
      <div className="grid grid-cols-2 gap-3">
        <StatusButton
          active={value}
          onClick={() => onChange(true)}
          icon={<CheckCircle size={14} className="text-green-600" />}
          label="Hari Kerja"
          activeColor="bg-green-50 border-green-200 text-green-700"
          inactiveColor="bg-white border-gray-300 text-gray-700"
        />
        <StatusButton
          active={!value}
          onClick={() => onChange(false)}
          icon={<AlertCircle size={14} className="text-amber-600" />}
          label="Bukan Hari Kerja"
          activeColor="bg-amber-50 border-amber-200 text-amber-700"
          inactiveColor="bg-white border-gray-300 text-gray-700"
        />
      </div>
    </div>
  );
}

function StatusButton({ active, onClick, icon, label, activeColor, inactiveColor }) {
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

function TextArea({ value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Keterangan (Opsional)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        rows={3}
      />
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
        className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
      >
        <Save size={16} />
        {isEdit ? 'Update Data' : 'Simpan Data'}
      </button>
    </div>
  );
}