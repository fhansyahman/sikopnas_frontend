"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

export function useSidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (title) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (href) => {
    return pathname === href;
  };

  const isSubmenuActive = (submenu) => {
    return submenu?.some(item => pathname === item.href);
  };

  return {
    pathname,
    openSubmenus,
    toggleSubmenu,
    isActive,
    isSubmenuActive
  };
}