"use client";

import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { TableFooter } from "./TableFooter";
import { LegendKeterangan } from "./LegendKeterangan";

export function RekapTable({ 
  rekapBulanan, 
  tahunFilter, 
  bulanFilter, 
  statistikBulanan,
  getDaysInMonth 
}) {
  // Validasi input
  if (!rekapBulanan || !Array.isArray(rekapBulanan) || rekapBulanan.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(parseInt(tahunFilter), parseInt(bulanFilter));
  
  // Validasi daysInMonth
  if (!daysInMonth || daysInMonth <= 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Format tanggal tidak valid
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0 text-black" id="rekap-table">
      <div className="min-w-full">
        <table className="w-full border border-gray-300 text-xs">
          <TableHeader daysInMonth={daysInMonth} />
          
          <tbody>
            {rekapBulanan.map((pegawai, index) => (
              <TableRow
                key={pegawai.id || index}
                pegawai={pegawai}
                index={index}
                daysInMonth={daysInMonth}
              />
            ))}
            
            <TableFooter
              daysInMonth={daysInMonth}
              statistik={statistikBulanan}
            />
          </tbody>
        </table>
      </div>
      
      <LegendKeterangan />
    </div>
  );
}