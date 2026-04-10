"use client";

import { useCallback } from "react";
import Swal from "sweetalert2";

export function useExport() {
  const exportToExcel = useCallback(async (
    rekapBulanan, 
    statistikBulanan, 
    bulanFilter, 
    tahunFilter, 
    wilayahFilter, 
    getBulanLabel
  ) => {
    if (!rekapBulanan.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Ada Data',
        text: 'Tidak ada data untuk diekspor',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F59E0B',
      });
      return;
    }

    try {
      // Import dinamis untuk menghindari error SSR
      const XLSX = await import('xlsx');
      
      const daysInMonth = new Date(parseInt(tahunFilter), parseInt(bulanFilter), 0).getDate();
      const bulanLabel = getBulanLabel(bulanFilter);
      
      // Header untuk Excel
      const wsData = [
        // Judul
        [`REKAP KEHADIRAN PEGAWAI - BULAN ${bulanLabel} ${tahunFilter}`],
        [wilayahFilter ? `Wilayah: ${wilayahFilter}` : 'Semua Wilayah'],
        [''],
        // Header tabel
        ['NO', 'NAMA', 'JABATAN', ...Array.from({length: daysInMonth}, (_, i) => (i + 1).toString()), 'H', 'T', 'I', 'TK']
      ];
      
      // Data pegawai
      rekapBulanan.forEach((pegawai, index) => {
        wsData.push([
          index + 1,
          pegawai.nama,
          pegawai.jabatan,
          ...pegawai.presensiHarian.map(status => status || ''),
          pegawai.totalHadir,
          pegawai.totalTerlambat,
          pegawai.totalIzin,
          pegawai.totalTanpaKeterangan
        ]);
      });
      
      // Total
      wsData.push([
        '',
        'TOTAL',
        '',
        ...Array(daysInMonth).fill(''),
        statistikBulanan.totalHadir,
        statistikBulanan.totalTerlambat,
        statistikBulanan.totalIzin,
        statistikBulanan.totalTanpaKeterangan
      ]);
      
      // Buat worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Atur lebar kolom
      const wscols = [
        { wch: 5 }, // NO
        { wch: 30 }, // NAMA
        { wch: 20 }, // JABATAN
        ...Array(daysInMonth).fill({ wch: 3 }), // Hari
        { wch: 5 }, // H
        { wch: 5 }, // T
        { wch: 5 }, // I
        { wch: 5 }  // TK
      ];
      ws['!cols'] = wscols;
      
      // Buat workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Rekap ${bulanLabel} ${tahunFilter}`);
      
      // Simpan file
      const fileName = `Rekap_Kehadiran_${bulanLabel}_${tahunFilter}${wilayahFilter ? `_${wilayahFilter}` : ''}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Data berhasil diekspor ke ${fileName}`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#10B981',
      });
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal mengekspor data ke Excel',
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#EF4444',
      });
    }
  }, []);

  const handlePrint = useCallback((
    bulanFilter, 
    tahunFilter, 
    wilayahFilter, 
    getBulanLabel
  ) => {
    const printContent = document.getElementById('rekap-table');
    
    if (!printContent) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Ada Data',
        text: 'Tidak ada data untuk dicetak',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F59E0B',
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      const bulanLabel = getBulanLabel(bulanFilter);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Rekap Kehadiran ${bulanLabel} ${tahunFilter}</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 20px; 
            }
            .print-header { 
              text-align: center; 
              margin-bottom: 20px; 
            }
            .print-header h1 { 
              margin: 0; 
              font-size: 20px; 
            }
            .print-header h2 { 
              margin: 5px 0; 
              font-size: 16px; 
              color: #666; 
            }
            .print-header h3 {
              margin: 5px 0;
              font-size: 14px;
              color: #666;
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              font-size: 11px; 
            }
            th, td { 
              border: 1px solid #000; 
              padding: 3px; 
              text-align: center; 
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold; 
            }
            .bg-green-50 { background-color: #f0fdf4; }
            .bg-amber-50 { background-color: #fffbeb; }
            .bg-purple-50 { background-color: #faf5ff; }
            .bg-red-50 { background-color: #fef2f2; }
            .bg-green-100 { background-color: #dcfce7; }
            .bg-amber-100 { background-color: #fef3c7; }
            .bg-purple-100 { background-color: #f3e8ff; }
            .bg-red-100 { background-color: #fee2e2; }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              font-size: 10px; 
              color: #666; 
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>REKAP KEHADIRAN PEGAWAI</h1>
            <h2>Bulan: ${bulanLabel} ${tahunFilter}</h2>
            ${wilayahFilter ? `<h3>Wilayah: ${wilayahFilter}</h3>` : ''}
          </div>
          ${printContent?.innerHTML || ''}
          <div class="footer">
            <p>Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} ${new Date().toLocaleTimeString('id-ID')}</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, []);

  return {
    exportToExcel,
    handlePrint
  };
}