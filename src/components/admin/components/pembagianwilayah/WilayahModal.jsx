"use client";

import { X, Save } from "lucide-react";

export function WilayahModal({ isOpen, onClose, formData, setFormData, onSubmit, isEdit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl">
        <ModalHeader title={isEdit ? 'Edit Wilayah' : 'Tambah Wilayah'} onClose={onClose} />

        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <InputField
              label="Nama Wilayah"
              required
              value={formData.nama_wilayah}
              onChange={(e) => setFormData({...formData, nama_wilayah: e.target.value})}
              placeholder="Masukkan nama wilayah"
            />

            <TextareaField
              label="Keterangan (Opsional)"
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              placeholder="Masukkan keterangan wilayah"
            />
          </div>

          <ModalFooter onClose={onClose} isEdit={isEdit} />
        </form>
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <X size={20} className="text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}

function InputField({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
    </div>
  );
}

function TextareaField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
      />
    </div>
  );
}

function ModalFooter({ onClose, isEdit }) {
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
        className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2"
      >
        <Save size={16} />
        {isEdit ? 'Update' : 'Simpan'}
      </button>
    </div>
  );
}