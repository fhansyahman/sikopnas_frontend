"use client";

import { useState, useEffect } from "react";
import { X, Calendar, FileText, User, Loader2, Clock, CheckCircle } from "lucide-react";
import { usersAPI } from "@/lib/api";
import Swal from "sweetalert2";

export function CreateIzinModal({ isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true); // State untuk auto-generate
  const [formData, setFormData] = useState({
    user_id: "",
    jenis: "Sakit",
    tanggal_mulai: "",
    tanggal_selesai: "",
    keterangan: "",
    dokumen_pendukung: null,
    status: "Disetujui" // Default langsung disetujui untuk admin
  });

  // Load daftar pegawai
  useEffect(() => {
    const loadUsers = async () => {
      if (!isOpen) return;
      
      try {
        setLoadingUsers(true);
        const response = await usersAPI.getAll();
        if (response.data?.success) {
          setUsers(response.data.data || []);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal memuat daftar pegawai',
          confirmButtonColor: '#EF4444'
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-adjust tanggal selesai jika tanggal mulai berubah
    if (name === 'tanggal_mulai' && formData.tanggal_selesai < value) {
      setFormData(prev => ({ ...prev, tanggal_selesai: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.user_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Pilih pegawai terlebih dahulu',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }

    if (!formData.tanggal_mulai || !formData.tanggal_selesai) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Tanggal mulai dan selesai harus diisi',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }

    if (formData.tanggal_selesai < formData.tanggal_mulai) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Tanggal selesai tidak boleh sebelum tanggal mulai',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }

    // Hitung durasi
    const start = new Date(formData.tanggal_mulai);
    const end = new Date(formData.tanggal_selesai);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Konfirmasi dengan info generate presensi
    const confirmResult = await Swal.fire({
      title: 'Buat Izin untuk Pegawai?',
      html: `
        <div class="text-left">
          <p class="mb-2">Detail Izin:</p>
          <ul class="text-sm space-y-1 mb-4">
            <li><span class="font-medium">Pegawai:</span> ${users.find(u => u.id === parseInt(formData.user_id))?.nama || '-'}</li>
            <li><span class="font-medium">Jenis:</span> ${formData.jenis}</li>
            <li><span class="font-medium">Periode:</span> ${formData.tanggal_mulai} s/d ${formData.tanggal_selesai}</li>
            <li><span class="font-medium">Durasi:</span> ${diffDays} hari</li>
          </ul>
          ${autoGenerate ? `
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
              <div class="flex items-center gap-2 text-green-700">
                <CheckCircle size={16} />
                <span class="font-medium">Auto-generate presensi AKTIF</span>
              </div>
              <p class="text-xs text-green-600 mt-1">
                Sistem akan otomatis mengisi presensi pegawai untuk ${diffDays} hari dengan status "Tanpa Keterangan"
              </p>
            </div>
          ` : `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
              <div class="flex items-center gap-2 text-yellow-700">
                <Clock size={16} />
                <span class="font-medium">Auto-generate presensi NONAKTIF</span>
              </div>
              <p class="text-xs text-yellow-600 mt-1">
                Presensi tidak akan digenerate otomatis. Pegawai harus mengisi manual.
              </p>
            </div>
          `}
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Buat Izin',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      width: '500px'
    });

    if (!confirmResult.isConfirmed) return;

    setLoading(true);
    try {
      // Kirim data dengan opsi auto_generate
      await onSubmit({
        ...formData,
        auto_generate: autoGenerate // Kirim flag ke backend
      });
      
      // Reset form setelah submit
      setFormData({
        user_id: "",
        jenis: "Sakit",
        tanggal_mulai: "",
        tanggal_selesai: "",
        keterangan: "",
        dokumen_pendukung: null,
        status: "Disetujui"
      });
      setAutoGenerate(true);
      onClose();

      // Tampilkan notifikasi sukses dengan detail
      Swal.fire({
        icon: 'success',
        title: 'Izin Berhasil Dibuat!',
        html: `
          <div class="text-left">
            <p class="mb-2">Izin untuk <span class="font-semibold">${users.find(u => u.id === parseInt(formData.user_id))?.nama}</span> telah dibuat.</p>
            <p class="mb-1">✓ Status: Disetujui</p>
            <p>✓ Durasi: ${diffDays} hari</p>
            ${autoGenerate ? '<p class="text-green-600 mt-2">✓ Presensi otomatis telah digenerate</p>' : ''}
          </div>
        `,
        confirmButtonColor: '#10B981',
        timer: 3000
      });

    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Buat Izin untuk Pegawai</h2>
            <p className="text-sm text-blue-600">Admin dapat membuat izin langsung disetujui</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Pilih Pegawai */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                <span>Pilih Pegawai <span className="text-red-500">*</span></span>
              </div>
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
              required
              disabled={loadingUsers}
            >
              <option value="">-- Pilih Pegawai --</option>
              {loadingUsers ? (
                <option disabled>Loading...</option>
              ) : (
                users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.nama} - {user.jabatan} ({user.wilayah_penugasan})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Jenis Izin */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                <span>Jenis Izin <span className="text-red-500">*</span></span>
              </div>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Sakit', 'Izin', 'Dinas Luar'].map((jenis) => (
                <label
                  key={jenis}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.jenis === jenis
                      ? jenis === 'Sakit' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : jenis === 'Izin'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="jenis"
                    value={jenis}
                    checked={formData.jenis === jenis}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {jenis}
                </label>
              ))}
            </div>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  <span>Tanggal Mulai <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                value={formData.tanggal_mulai}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  <span>Tanggal Selesai <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                value={formData.tanggal_selesai}
                onChange={handleChange}
                min={formData.tanggal_mulai}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                required
              />
            </div>
          </div>

          {/* Durasi Preview */}
          {formData.tanggal_mulai && formData.tanggal_selesai && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">Durasi Izin:</span>
                <span className="text-sm font-bold text-blue-800">
                  {(() => {
                    const start = new Date(formData.tanggal_mulai);
                    const end = new Date(formData.tanggal_selesai);
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    return `${diffDays} hari`;
                  })()}
                </span>
              </div>
            </div>
          )}

          {/* Keterangan */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                <span>Keterangan (Opsional)</span>
              </div>
            </label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows={3}
              placeholder="Masukkan keterangan tambahan jika perlu..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Auto-generate Presensi Option */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  autoGenerate 
                    ? 'bg-green-500 border-green-500' 
                    : 'bg-white border-gray-300'
                }`}>
                  {autoGenerate && <CheckCircle size={14} className="text-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Generate Presensi Otomatis</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Jika aktif, sistem akan otomatis mengisi presensi pegawai pada tanggal izin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoGenerate(!autoGenerate)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  autoGenerate 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {autoGenerate ? 'Aktif' : 'Nonaktif'}
              </button>
            </label>
          </div>

          {/* Status Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-blue-800">
                Status: Langsung Disetujui
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Izin yang dibuat oleh admin akan langsung berstatus Disetujui.
              {autoGenerate && ' Presensi akan otomatis digenerate sesuai tanggal izin.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || loadingUsers}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Buat Izin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}