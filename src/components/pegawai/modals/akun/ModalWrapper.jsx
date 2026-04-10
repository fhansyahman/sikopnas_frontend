"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

// Komponen ModalWrapper dengan semua komponen reusable di dalamnya
export function ModalWrapper({ 
  children, 
  onClose, 
  title, 
  size = "md" 
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`bg-white rounded-xl ${sizeClasses[size]} w-full max-h-[80vh] overflow-y-auto`}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-slate-200">
          {title && <h2 className="text-xl font-bold text-slate-800">{title}</h2>}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-auto"
            aria-label="Tutup"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Komponen TermSection yang diekspor
export function TermSection({ title, content }) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

// Komponen InputField yang diekspor
export function InputField({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        required
      />
    </div>
  );
}

// Komponen ModalActions yang diekspor
export function ModalActions({ onClose, submitLabel, onSubmit }) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
      >
        Batal
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {submitLabel}
      </button>
    </div>
  );
}