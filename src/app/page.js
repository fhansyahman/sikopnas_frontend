'use client';

import { ArrowRight, Shield, BarChart3, Users, Clock, Database, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Monitoring Real-time',
      description: 'Pantau kinerja pegawai secara langsung dan real-time 24/7'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Multi-User Role',
      description: 'Sistem dengan 3 level akses: Admin, Atasan, dan Pegawai'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Data Terintegrasi',
      description: 'Seluruh data tersimpan secara terpusat dan terintegrasi'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Keamanan Data',
      description: 'Sistem keamanan berlapis untuk perlindungan data sensitif'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Histori Lengkap',
      description: 'Pencatatan dan pelacakan histori kinerja secara detail'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Akses Terkontrol',
      description: 'Hak akses yang diatur berdasarkan peran pengguna'
    }
  ];

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />
        
        {/* Animated blob elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />

        <header className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">


              <div>
                <h1 className="text-xl sm:text-4xl font-bold text-gray-900 font-extrabold">
                  SIKO<span className="text-yellow-500">PNAS</span>
                </h1>
              </div>
            </div>
            
            <Link
              href="/login"
              className="group relative px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto text-center"
            >
              <span className="flex items-center justify-center gap-2">
                Masuk
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </header>

        <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
              <div className="lg:w-1/2 space-y-6 sm:space-y-8">
                <div>
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                    Sistem Terintegrasi V1.0
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Pantau Kinerja
                    <span className="block text-blue-600">Lebih Efisien</span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-4 sm:mt-6 leading-relaxed">
                    Sistem pemantauan kinerja pekerja Non-ASN terintegrasi pertama untuk 
                    Wilayah Prajekan Kabupaten Bondowoso. Solusi digital untuk manajemen 
                    kinerja yang lebih transparan dan akurat.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <Link
                    href="/login"
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      Mulai Sekarang
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">100%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Data Akurat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-600">24/7</div>
                    <div className="text-xs sm:text-sm text-gray-600">Akses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-600">3</div>
                    <div className="text-xs sm:text-sm text-gray-600">Level Akses</div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg">
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center ">
 <h2 className="text-6xl sm:text-5xl md:text-8xl font-bold text-gray-900 text-center font-extrabold relative z-50">
  SIKO<span className="text-yellow-500">PNAS</span>
</h2>
                  </div>
                  
                  <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-28 h-28 sm:w-40 sm:h-40 bg-blue-100 rounded-3xl rotate-12 opacity-50" />
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-28 h-28 sm:w-40 sm:h-40 bg-emerald-100 rounded-3xl -rotate-12 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <section id="features" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Fitur Unggulan <span className="text-blue-600">SIKOPNAS</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Sistem lengkap dengan segala yang Anda butuhkan untuk manajemen kinerja yang optimal
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="inline-flex p-2 sm:p-3 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-lg sm:rounded-xl text-blue-600 mb-4 sm:mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Siap Mengoptimalkan Manajemen Kinerja?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 sm:mb-10">
              Bergabunglah dengan sistem pemantauan kinerja terdepan untuk instansi pemerintah
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-blue-600 font-bold rounded-lg sm:rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <span>Masuk untuk login</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">

              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">
                  SIKO<span className="text-yellow-400">PNAS</span>
                </h3>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm sm:text-base">
                © {new Date().getFullYear()} SIKOPNAS. Hak Cipta Dilindungi.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
