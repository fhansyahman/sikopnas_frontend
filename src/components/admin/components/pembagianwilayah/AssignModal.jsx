"use client";

import { X, UserCheck } from "lucide-react";

export function AssignModal({ isOpen, onClose, selectedUser, assignmentData, setAssignmentData, wilayahList, onSubmit }) {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl">
        <ModalHeader onClose={onClose} user={selectedUser} />

        <div className="p-6 border-b border-gray-200">
          <UserInfo user={selectedUser} />
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <SelectField
            label="Pilih Wilayah"
            required
            value={assignmentData.wilayah_id}
            onChange={(e) => setAssignmentData({...assignmentData, wilayah_id: e.target.value})}
            options={wilayahList}
          />

          <Footer onClose={onClose} />
        </form>
      </div>
    </div>
  );
}

function ModalHeader({ onClose, user }) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Tugaskan Wilayah</h2>
        <p className="text-sm text-blue-600">Untuk {user.nama}</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <X size={20} className="text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}

function UserInfo({ user }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="font-medium text-gray-900">{user.nama}</p>
      <p className="text-sm text-gray-600">{user.jabatan}</p>
      <p className="text-sm text-gray-500 mt-2">
        Wilayah saat ini: {user.wilayah_penugasan || 'Belum ditugaskan'}
      </p>
    </div>
  );
}

function SelectField({ label, required, value, onChange, options }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          required
        >
          <option value="">Pilih Wilayah</option>
          {options.map((wilayah) => (
            <option key={wilayah.id} value={wilayah.id}>
              {wilayah.nama_wilayah}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Footer({ onClose }) {
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
        <UserCheck size={16} />
        Tugaskan
      </button>
    </div>
  );
}