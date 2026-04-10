"use client";

import { useRouter } from "next/navigation";
import { Home, User } from "lucide-react";

export function BottomNav() {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-lg flex justify-around py-3">
      <NavButton
        icon={<Home size={22} />}
        label="Home"
        onClick={() => router.push("/pegawai/dashboard")}
        active={false}
      />

      <NavButton
        icon={<User size={22} />}
        label="Akun"
        onClick={() => router.push("/pegawai/akun")}
        active={true}
      />
    </div>
  );
}

function NavButton({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
        active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {icon}
      <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
        {label}
      </span>
    </button>
  );
}