"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function SidebarItem({ title, icon, submenu, active, href, currentPath }) {
  const [open, setOpen] = useState(active || false);
  
  const isActive = active || 
    (href && currentPath === href) ||
    (submenu && submenu.some(item => currentPath === item.href));
  
  const handleClick = (e) => {
    if (submenu) {
      e.preventDefault();
      setOpen(!open);
    }
  };

  return (
    <li className="mb-1">
      <Link
        href={href || "#"}
        onClick={handleClick}
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 no-underline block ${
          isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 
          'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={isActive ? 'text-white' : 'text-gray-400'}>
            {icon}
          </span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        {submenu && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            } ${isActive ? 'text-white' : 'text-gray-400'}`}
          />
        )}
      </Link>

      {submenu && open && (
        <ul className="ml-8 mt-1 space-y-1">
          {submenu.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors no-underline block ${
                  currentPath === item.href 
                    ? 'bg-gray-800 text-cyan-400' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400'
                }`}
              >
                <span className={currentPath === item.href ? 'text-cyan-400' : 'text-cyan-500'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}