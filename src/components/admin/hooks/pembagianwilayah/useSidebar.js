"use client";

import { useState } from 'react'; // TIDAK PERLU useEffect
import { useRouter } from "next/navigation";

export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return {
    sidebarOpen,
    setSidebarOpen,
    handleLogout
  };
}