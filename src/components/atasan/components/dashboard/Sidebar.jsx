"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Sidebar({ isOpen, onClose, menuItems }) {
  const router = useRouter();

  return (
    <aside className={`fixed md:relative z-30 h-full bg-gray-900 border-r border-gray-800 shadow-2xl transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
      md:translate-x-0 md:w-64`}>
      
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-bold text-lg text-white">SIKOPNAS</h1>
            <p className="text-xs text-cyan-400">Sistem UPT Wilayah Prajekan</p>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <SidebarItem key={index} item={item} router={router} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SidebarItem({ item, router }) {
  const [open, setOpen] = useState(item.active || false);
  const isActive = item.active;

  const handleClick = (e) => {
    if (item.submenu) {
      e.preventDefault();
      setOpen(!open);
    } else if (item.onClick) {
      e.preventDefault();
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <li className="mb-1">
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={isActive ? 'text-white' : 'text-gray-400'}>
            {item.icon}
          </span>
          <span className="text-sm font-medium">{item.title}</span>
        </div>
        {item.submenu && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            } ${isActive ? 'text-white' : 'text-gray-400'}`}
          />
        )}
      </button>

      {item.submenu && open && (
        <ul className="ml-8 mt-1 space-y-1">
          {item.submenu.map((subItem, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  if (subItem.onClick) {
                    subItem.onClick();
                  } else {
                    router.push(subItem.href);
                  }
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                  subItem.active 
                    ? 'bg-gray-800 text-cyan-400' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400'
                }`}
              >
                <span className={subItem.active ? 'text-cyan-400' : 'text-cyan-500'}>
                  {subItem.icon}
                </span>
                <span>{subItem.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}