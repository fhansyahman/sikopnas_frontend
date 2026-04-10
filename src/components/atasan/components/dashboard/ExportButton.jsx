"use client";

import { Download, FileSpreadsheet, FileText, Database, Users, MapPin, ClipboardList, Image } from "lucide-react";
import { useState } from "react";

// Export Button untuk single button
export function ExportButton({ 
  onClick, 
  disabled, 
  label = 'Export Data',
  icon = null
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      {icon ? icon : <Download size={16} />}
      <span>{label}</span>
    </button>
  );
}

// Export Button untuk export gambar
export function ExportImageButton({ onClick, disabled, label = 'Export Grafik' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      <Image size={16} className="text-blue-600" />
      <span>{label}</span>
    </button>
  );
}

// Export Button Group untuk multiple options
export function ExportButtonGroup({ 
  onExportPegawai,
  onExportWilayah,
  onExportRekap,
  onExportAll,
  onExportChart,
  onExportData,
  disabled 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    { label: 'Export Kinerja Pegawai', icon: Users, onClick: onExportPegawai, color: 'blue' },
    { label: 'Export Statistik Wilayah', icon: MapPin, onClick: onExportWilayah, color: 'purple' },
    { label: 'Export Rekap Kinerja', icon: ClipboardList, onClick: onExportRekap, color: 'green' },
    { label: 'Export Semua Data', icon: Database, onClick: onExportAll, color: 'orange' },
  ];

  // Untuk presensi
  const presensiOptions = [
    { label: 'Export Grafik', icon: Image, onClick: onExportChart, color: 'blue' },
    { label: 'Export Data', icon: FileSpreadsheet, onClick: onExportData, color: 'green' },
  ];

  // Pilih options berdasarkan props yang tersedia
  const options = onExportPegawai ? exportOptions : presensiOptions;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <Download size={16} />
        <span>Export Data</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                Pilih Data yang akan Diekspor
              </div>
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    option.onClick?.();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <option.icon size={16} className={`text-${option.color}-500`} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}