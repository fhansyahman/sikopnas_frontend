// app/login/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import { Loader2, Eye, EyeOff, Phone } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // State untuk cek autentikasi awal
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const { login, user } = useAuth();
  const router = useRouter();

  // 🔧 CEK APAKAH SUDAH LOGIN SEBELUM MENAMPILKAN HALAMAN LOGIN
  useEffect(() => {
    const checkAlreadyLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        // Verifikasi token ke backend
        const response = await authAPI.getProfile();
        
        if (response.data.success) {
          // Jika token valid, langsung redirect ke dashboard sesuai role
          const role = response.data.data.roles;
          redirectToDashboard(role);
          return;
        }
      } catch (error) {
        // Token tidak valid, hapus data localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAlreadyLoggedIn();
  }, []);

  // Fungsi redirect berdasarkan role
  const redirectToDashboard = (role) => {
    setRedirecting(true);
    setTimeout(() => {
      switch (role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'atasan':
          router.push('/atasan/dashboard');
          break;
        case 'pegawai':
          router.push('/pegawai/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    }, 500);
  };

  // Tampilkan loading sambil mengecek autentikasi
  if (checkingAuth) {
    return (
      <div className="login-container relative">
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-50">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="mt-4 text-gray-700 text-lg font-semibold">
            Memeriksa sesi login...
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading || redirecting) return;
    
    try {
      setLoading(true);
      setError('');
      setRedirecting(false);

      const response = await authAPI.login(formData);
      
      if (response.data.success) {
        if (login) {
          login(response.data.data.token, response.data.data.user);
        }
        
        setRedirecting(true);
        
        setTimeout(() => {
          const role = response.data.data.user.roles;
          switch (role) {
            case 'admin':
              router.push('/admin/dashboard');
              break;
            case 'atasan':
              router.push('/atasan/dashboard');
              break;
            case 'pegawai':
              router.push('/pegawai/dashboard');
              break;
            default:
              router.push('/dashboard');
          }
        }, 500);
        
      } else {
        setError(response.data.message || 'Login gagal');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
      
      if (error.response) {
        const serverMessage = error.response.data?.message;
        if (serverMessage) {
          errorMessage = serverMessage;
        } else if (error.response.status === 401) {
          errorMessage = 'Username atau password salah';
        } else if (error.response.status === 500) {
          errorMessage = 'Server sedang mengalami masalah';
        }
      } else if (error.request) {
        errorMessage = 'Tidak dapat terhubung ke server';
      } else {
        errorMessage = error.message || 'Login gagal';
      }
      
      setError(errorMessage);
      setLoading(false);
      setRedirecting(false);
    }
  };

  const handleForgotPassword = () => {
    const adminWhatsAppNumber = '6281234567890';
    const adminName = 'Admin SIKOPNAS';
    const message = `Halo ${adminName}, saya lupa password akun SIKOPNAS. Mohon bantuannya untuk reset password.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="login-container relative">
      {/* Overlay Loading Saat Redirect */}
      {redirecting && (
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="mt-4 text-gray-700 text-lg font-semibold">
            Memuat halaman berikutnya...
          </p>
        </div>
      )}

      <div className="login-card">
        <div className="login-info">
          <h1 className="login-title">
            SIKO<span className="highlight-yellow">PNAS</span>
          </h1>
          <p className="login-desc">
            Sistem Informasi Kinerja Operasional Pemantauan<br />
            Non-ASN Wilayah Prajekan Kabupaten Bondowoso
          </p>
        </div>

        <div className="login-form-section">
          <h2 className="login-header">LOGIN</h2>

          {error && (
            <div className="login-error animate-fadeIn">
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label className="login-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="login-input"
                required
                disabled={loading || redirecting}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="login-label" htmlFor="password">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="login-input pr-10"
                  required
                  disabled={loading || redirecting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading || redirecting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || redirecting}
              className={`login-button ${loading || redirecting ? "login-loading" : ""}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Proses login...
                </span>
              ) : redirecting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Mengalihkan...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={handleForgotPassword}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 hover:underline transition-colors duration-200"
              disabled={loading || redirecting}
              title="Hubungi Admin via WhatsApp"
            >
              <Phone size={14} />
              <span>Lupa sandi? Hubungi Admin via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}