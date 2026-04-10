"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserHeader } from "./components/akun/UserHeader";
import { InfoCard } from "./components/akun/InfoCard";
import { MenuCard } from "./components/akun/MenuCard";
import { BottomNav } from "./components/akun/BottomNav";
import { PasswordModal } from "./modals/akun/PasswordModal";
import { TermsModal } from "./modals/akun/TermsModal";
import { PrivacyModal } from "./modals/akun/PrivacyModal";
import { LogoutModal } from "./modals/akun/LogoutModal";
import { useUserData } from "./hooks/akun/useUserData";

export default function AkunPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const { userData, loadingUser } = useUserData();

  const handleLogout = () => {
    // Hapus token dari localStorage dan cookie
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("🚪 User logout");
    router.push("/login");
  };

  // Tampilkan loading jika user masih diambil
  if (loadingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Memuat data akun...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      {/* Header dengan foto profil */}
      <UserHeader userData={userData} />

      {/* Info Card */}
      <InfoCard userData={userData} />

      {/* Menu Card */}
      <MenuCard 
        onPasswordClick={() => setShowPasswordModal(true)}
        onTermsClick={() => setShowTermsModal(true)}
        onPrivacyClick={() => setShowPrivacyModal(true)}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modals */}
      <PasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
      
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
      
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}