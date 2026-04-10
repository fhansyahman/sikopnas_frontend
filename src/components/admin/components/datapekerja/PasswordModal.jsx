"use client";

import { X } from "lucide-react";

export function PasswordModal({ isOpen, onClose, user, passwordData, setPasswordData, onSubmit }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Reset Password</h2>
            <p className="text-sm text-blue-600 mt-1">Untuk: {user?.nama}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={passwordData.password}
                onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Minimal 6 karakter"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ulangi password"
              />
            </div>

            {/* Password strength indicator */}
            {passwordData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className={`h-1 flex-1 rounded ${
                    passwordData.password.length < 6 ? 'bg-red-500' :
                    passwordData.password.length < 8 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="text-xs text-gray-600">
                    {passwordData.password.length < 6 ? 'Lemah' :
                     passwordData.password.length < 8 ? 'Sedang' :
                     'Kuat'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!passwordData.password || !passwordData.confirmPassword || passwordData.password.length < 6}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}