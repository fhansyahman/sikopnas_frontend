// app/telegram-integration/page.jsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle, CheckCircle, XCircle, Link, Unlink, Bot, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TelegramIntegrationPage() {
  const [loading, setLoading] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [botUsername, setBotUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadTelegramStatus();
    loadBotInfo();
  }, []);

  const loadTelegramStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/telegram/status', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setTelegramStatus(data.data);
      }
    } catch (error) {
      console.error('Error loading telegram status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBotInfo = async () => {
    // Simulasi mendapatkan username bot dari environment
    const botUser = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "sikopnas_bot";
    setBotUsername(botUser);
  };

  const handleDisconnect = async () => {
    if (!confirm("Yakin ingin memutus koneksi Telegram?")) return;

    try {
      setLoading(true);
      const response = await fetch('/api/telegram/disconnect', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        await loadTelegramStatus();
        alert('Koneksi Telegram berhasil diputus');
      } else {
        throw new Error('Gagal memutus koneksi');
      }
    } catch (error) {
      console.error('Error disconnecting telegram:', error);
      alert('Gagal memutus koneksi Telegram');
    } finally {
      setLoading(false);
    }
  };

  const copyBotUsername = () => {
    navigator.clipboard.writeText(botUsername);
    alert(`Username bot ${botUsername} berhasil disalin!`);
  };

  const openTelegram = () => {
    window.open(`https://t.me/${botUsername}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-blue-800 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/pegawai')}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Integrasi Telegram</h1>
                <p className="text-blue-200 mt-1">Terima notifikasi langsung di Telegram</p>
              </div>
            </div>
            <div className="bg-blue-500/30 rounded-full p-3">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Status Koneksi</h2>
              <p className="text-gray-600 text-sm mt-1">
                {telegramStatus?.is_connected 
                  ? "Akun Anda terhubung dengan Telegram" 
                  : "Belum terhubung dengan Telegram"
                }
              </p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              telegramStatus?.is_connected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {telegramStatus?.is_connected ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Terhubung</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Belum Terhubung</span>
                </>
              )}
            </div>
          </div>

          {telegramStatus?.is_connected && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-medium">✅ Akun Telegram Terhubung</p>
                  <p className="text-blue-600 text-sm mt-1">
                    ID Telegram: {telegramStatus.telegram_id}
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Unlink className="w-4 h-4" />
                  <span>Putuskan</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Connection Instructions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Cara Menghubungkan</h2>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {showInstructions ? 'Sembunyikan' : 'Tampilkan'} Panduan
            </button>
          </div>

          {showInstructions && (
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Buka Telegram</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Buka aplikasi Telegram di smartphone Anda
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Cari Bot</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Cari bot kami dengan username:{" "}
                    <button
                      onClick={copyBotUsername}
                      className="text-blue-600 hover:text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded"
                    >
                      @{botUsername}
                    </button>
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Mulai Chat</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Ketik <code className="bg-gray-100 px-2 py-1 rounded text-sm">/start</code> untuk memulai
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Masukkan Nama</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Ketik <strong>nama lengkap Anda</strong> sesuai yang terdaftar di sistem
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={openTelegram}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Bot className="w-5 h-5" />
              <span>Buka Telegram</span>
            </button>
            
            <button
              onClick={copyBotUsername}
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Link className="w-5 h-5" />
              <span>Salin Username Bot</span>
            </button>
          </div>
        </div>

        {/* Features Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Fitur Notifikasi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Notifikasi Aktivitas</h3>
                <p className="text-green-600 text-sm mt-1">
                  Dapatkan pemberitahuan ketika aktivitas harian disetujui
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800">Notifikasi Kinerja</h3>
                <p className="text-purple-600 text-sm mt-1">
                  Informasi laporan kinerja harian langsung ke Telegram
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">Pengingat</h3>
                <p className="text-orange-600 text-sm mt-1">
                  Pengingat untuk mengisi laporan harian
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Notifikasi Penting</h3>
                <p className="text-red-600 text-sm mt-1">
                  Informasi penting dan update sistem
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}