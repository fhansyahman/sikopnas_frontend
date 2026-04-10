"use client";

import { useEffect, useRef } from "react";
import { Eye, Edit, Key, Trash2 } from "lucide-react";

export function ActionMenu({ user, onClose, onViewDetail, onEdit, onPasswordReset, onDelete }) {
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { 
      label: "Lihat Detail", 
      icon: Eye, 
      onClick: () => {
        onViewDetail(user);
        onClose();
      },
      color: "text-gray-700 hover:bg-gray-100"
    },
    { 
      label: "Edit Data", 
      icon: Edit, 
      onClick: () => {
        onEdit(user);
        onClose();
      },
      color: "text-gray-700 hover:bg-gray-100"
    },
    { 
      label: "Reset Password", 
      icon: Key, 
      onClick: () => {
        onPasswordReset(user);
        onClose();
      },
      color: "text-gray-700 hover:bg-gray-100"
    },
    { 
      label: "Hapus Pengguna", 
      icon: Trash2, 
      onClick: () => {
        onDelete(user);
        onClose();
      },
      color: "text-red-600 hover:bg-red-50",
      divider: true
    }
  ];

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1"
    >
      {menuItems.map((item, index) => (
        <>
          {item.divider && <div key={`divider-${index}`} className="border-t border-gray-200 my-1"></div>}
          <button
            key={index}
            onClick={item.onClick}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${item.color}`}
          >
            <item.icon size={14} />
            {item.label}
          </button>
        </>
      ))}
    </div>
  );
}