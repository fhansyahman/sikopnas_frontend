"use client";

import { memo } from "react";

export const TableRow = memo(function TableRow({ pegawai, index, daysInMonth }) {
  const getStatusClass = (status) => {
    switch(status) {
      case 'H': return 'bg-green-100 text-green-800 border-green-200';
      case 'T': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'I': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'TK': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };

  const getStatusTooltip = (status) => {
    switch(status) {
      case 'H': return 'Hadir Tepat Waktu';
      case 'T': return 'Terlambat';
      case 'I': return 'Izin';
      case 'TK': return 'Tanpa Keterangan';
      default: return '';
    }
  };

  // Validasi dan default values
  const safePegawai = pegawai || {};
  const presensiHarian = Array.isArray(safePegawai.presensiHarian) ? safePegawai.presensiHarian : [];
  const totalHadir = safePegawai.totalHadir || 0;
  const totalTerlambat = safePegawai.totalTerlambat || 0;
  const totalIzin = safePegawai.totalIzin || 0;
  const totalTanpaKeterangan = safePegawai.totalTanpaKeterangan || 0;
  const nama = safePegawai.nama || '-';
  const jabatan = safePegawai.jabatan || '-';

  // Validasi daysInMonth
  const safeDaysInMonth = daysInMonth && !isNaN(daysInMonth) && daysInMonth > 0 ? daysInMonth : 31;
  const daysArray = Array.from({ length: safeDaysInMonth }, (_, i) => i);

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      {/* Nomor Urut */}
      <td className="border border-gray-300 p-2 text-center font-medium bg-white">
        {index + 1}
      </td>
      
      {/* Nama Pegawai */}
      <td className="border border-gray-300 p-2 text-sm md:text-base font-medium text-gray-800 bg-white sticky left-0 bg-white">
        {nama}
      </td>
      
      {/* Jabatan */}
      <td className="border border-gray-300 p-2 text-sm md:text-base text-gray-600">
        {jabatan}
      </td>
      
      {/* Data Harian per Tanggal */}
      {daysArray.map((_, dayIndex) => {
        const status = presensiHarian[dayIndex];
        const hasStatus = status && status !== '';
        
        return (
          <td 
            key={dayIndex} 
            className="border border-gray-300 p-1 text-center align-middle"
          >
            {hasStatus ? (
              <span 
                className={`
                  inline-flex items-center justify-center
                  w-6 h-6 md:w-7 md:h-7 
                  rounded-full 
                  text-xs md:text-sm font-bold 
                  transition-all duration-150
                  hover:scale-110 cursor-help
                  ${getStatusClass(status)}
                `}
                title={getStatusTooltip(status)}
              >
                {status}
              </span>
            ) : (
              <span className="inline-block w-6 h-6 md:w-7 md:h-7 rounded-full text-xs">
                {/* Empty cell - bisa dikosongkan atau ditambahkan titik */}
              </span>
            )}
          </td>
        );
      })}
      
      {/* Total Hadir (H) */}
      <td className="border border-gray-300 p-2 text-center font-bold bg-green-50 text-green-700">
        {totalHadir}
      </td>
      
      {/* Total Terlambat (T) */}
      <td className="border border-gray-300 p-2 text-center font-bold bg-amber-50 text-amber-700">
        {totalTerlambat}
      </td>
      
      {/* Total Izin (I) */}
      <td className="border border-gray-300 p-2 text-center font-bold bg-purple-50 text-purple-700">
        {totalIzin}
      </td>
      
      {/* Total Tanpa Keterangan (TK) */}
      <td className="border border-gray-300 p-2 text-center font-bold bg-red-50 text-red-700">
        {totalTanpaKeterangan}
      </td>
    </tr>
  );
});

// Display name untuk debugging
TableRow.displayName = 'TableRow';