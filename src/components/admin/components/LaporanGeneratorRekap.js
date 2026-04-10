'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Download, 
  FileText, 
  Loader2,
  Check,
  X,
  AlertCircle,
  FileOutput,
  Layers,
  Users,
  Building,
  Calendar,
  Table as TableIcon,
  Grid,
  Image as ImageIcon
} from 'lucide-react';

export default function LaporanGeneratorRekap({ data, wilayah, tanggal, isLoading = false }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState({
    halaman1: true,
    halaman2: true
  });

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '06 Januari 2025';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '06 Januari 2025';
    }
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '06-01-2025';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return '06-01-2025';
    }
  };

  // Fungsi untuk memotong data per halaman (3 baris per halaman)
  const chunkDataForPages = (dataArray, rowsPerPage = 3) => {
    const pages = [];
    for (let i = 0; i < dataArray.length; i += rowsPerPage) {
      pages.push(dataArray.slice(i, i + rowsPerPage));
    }
    return pages;
  };

  // Generate konten untuk Halaman 1 (Tabel Rekap) - LANDSCAPE dengan SKET SANGAT BESAR
  // dengan 3 baris data per halaman dan keterangan "Panjang" di atas KR & KN
  const generatePage1Content = (pageData, pageIndex, totalPages) => {
    if (!pageData || pageData.length === 0) return '';
    const isLastPage = pageIndex === totalPages - 1;
    // Hitung total untuk halaman ini
    const pageTotalKR = pageData.reduce((sum, item) => sum + (parseFloat(item.panjang_kr) || 0), 0);
    const pageTotalKN = pageData.reduce((sum, item) => sum + (parseFloat(item.panjang_kn) || 0), 0);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rekap Hasil Kerja Lapangan</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: "Times New Roman", serif;
            margin: 0;
            padding: 15mm 10mm;
            width: 297mm;
            min-height: 210mm;
            background: white;
            color: #000000 !important;
            position: relative;
          }
          
          .header {
            text-align: center;
            margin-bottom: 15px;
            color: #000000 !important;
          }
          
          .header h3 {
            margin: 2px 0;
            font-size: 14pt;
            color: #000000 !important;
            font-weight: bold;
          }
          
          .header h4 {
            margin: 2px 0;
            font-size: 11pt;
            font-weight: normal;
            color: #000000 !important;
          }
          
          h3.title {
            text-align: center;
            margin: 10px 0 5px 0;
            font-size: 13pt;
            text-decoration: underline;
            color: #000000 !important;
            font-weight: bold;
          }
          
          .table-container {
            width: 100%;
            overflow-x: auto;
            margin: 10px 0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            color: #000000 !important;
            table-layout: fixed;
          }
          
          th, td {
            border: 1px solid #000000 !important;
            padding: 6px 4px;
            vertical-align: middle;
            color: #000000 !important;
          }
          
          th {
            text-align: center;
            background-color: #f2f2f2;
            font-weight: bold;
            color: #000000 !important;
            font-size: 9pt;
          }
          
          td {
            text-align: left;
            color: #000000 !important;
          }
          
          /* Kolom SKET diperbesar SANGAT BESAR */
          .sket-cell {
            width: 180px;
            height: 90px;
            padding: 3px;
            text-align: center;
            vertical-align: middle;
          }
          
          .sket-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .sket-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border: 1px solid #cccccc;
          }
          
          .sket-placeholder {
            width: 100%;
            height: 100%;
            background: #f9f9f9;
            border: 1px dashed #cccccc;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000000 !important;
            font-size: 8pt;
            padding: 3px;
          }
          
          .measurement {
            text-align: center;
            font-weight: bold;
            color: #000000 !important;
          }
          
          /* Subtitle untuk KR dan KN */
          .measurement-subtitle {
            font-size: 8pt;
            font-weight: normal;
            color: #000000 !important;
            margin-top: 2px;
          }
          
          /* Lebar kolom yang dioptimasi */
          colgroup col:nth-child(1) { width: 4%; }   /* NO */
          colgroup col:nth-child(2) { width: 12%; }  /* NAMA */
          colgroup col:nth-child(3) { width: 18%; }  /* RUAS JALAN */
          colgroup col:nth-child(4) { width: 25%; }  /* KEGIATAN */
          colgroup col:nth-child(5) { width: 23%; }  /* SKET */
          colgroup col:nth-child(6) { width: 9%; }   /* KR */
          colgroup col:nth-child(7) { width: 9%; }   /* KN */
          
          /* Keterangan sederhana */
          .keterangan-sederhana {
            margin-top: 5px;
            font-size: 8pt;
            color: #000000 !important;
          }
          
          .keterangan-sederhana p {
            margin: 2px 0;
            color: #000000 !important;
          }
          
          .ttd-container {
            margin-top: 20px;
            width: 100%;
          }
          
          .ttd {
            display: flex;
            justify-content: space-between;
            font-size: 10pt;
            color: #000000 !important;
          }
          
          .ttd > div {
            width: 45%;
            text-align: center;
            color: #000000 !important;
          }
          
          .ttd-space {
            height: 50px;
            margin: 3px 0;
          }
          
          .ttd-line {
            width: 180px;
            height: 1px;
            background: #000000 !important;
            margin: 30px auto 3px auto;
          }
          
          .page-number {
            position: absolute;
            bottom: 10mm;
            right: 15mm;
            font-size: 9pt;
            color: #000000 !important;
          }
          
          /* Style untuk teks yang wrap */
          .wrap-cell {
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            overflow-wrap: break-word;
          }
          
          p, span, div, h1, h2, h3, h4, h5, h6, li, b, strong {
            color: #000000 !important;
          }
          
          b, strong {
            font-weight: bold !important;
            color: #000000 !important;
          }
          
          .total-row {
            background-color: #f2f2f2 !important;
            font-weight: bold;
          }
          
          .page-info {
            text-align: right;
            font-size: 8pt;
            margin-top: 5px;
            color: #000000 !important;
          }
          
          @media print {
            body {
              padding: 15mm 10mm;
              width: 297mm;
              min-height: 210mm;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body style="color: #000000 !important;">
        <div class="header">
          <h3 style="color: #000000 !important;">UNIT PELAKSANA TEKNIS BINA MARGA</h3>
          <h3 style="color: #000000 !important;">WILAYAH PRAJEKAN</h3>
        </div>

        <h3 class="title" style="color: #000000 !important;">HASIL KERJA LAPANGAN</h3>
        <h4 style="text-align: center; margin: 2px 0; color: #000000 !important;">WILAYAH ${wilayah.toUpperCase()}</h4>
        <h4 style="text-align: center; margin: 2px 0 5px 0; color: #000000 !important;">Tanggal : ${formatDate(tanggal)}</h4>

        <div class="table-container">
          <table>
            <colgroup>
              <col style="width: 4%">
              <col style="width: 12%">
              <col style="width: 18%">
              <col style="width: 25%">
              <col style="width: 23%"> <!-- Kolom SKET sangat besar -->
              <col style="width: 9%">
              <col style="width: 9%">
            </colgroup>
            <thead>
              <tr>
                <th rowspan="2" style="color: #000000 !important;">NO</th>
                <th rowspan="2" style="color: #000000 !important;">NAMA</th>
                <th rowspan="2" style="color: #000000 !important;">RUAS JALAN</th>
                <th rowspan="2" style="color: #000000 !important;">KEGIATAN</th>
                <th rowspan="2" style="color: #000000 !important;">SKET LOKASI</th>
                <th colspan="2" style="color: #000000 !important;">PANJANG (Meter)</th>
              </tr>
              <tr>
                <th style="color: #000000 !important;">KR</th>
                <th style="color: #000000 !important;">KN</th>
              </tr>
            </thead>
            <tbody>
              ${pageData.map((item, index) => {
                const rowNumber = (pageIndex * 3) + index + 1;
                return `
                  <tr>
                    <td align="center" style="color: #000000 !important;">${rowNumber}</td>
                    <td style="color: #000000 !important;" class="wrap-cell">
                      ${item.nama || '-'}
                    </td>
                    <td style="color: #000000 !important;" class="wrap-cell">
                      ${item.ruas_jalan || '-'}
                    </td>
                    <td style="color: #000000 !important;" class="wrap-cell">
                      ${item.kegiatan || '-'}
                    </td>
                    <td class="sket-cell" style="color: #000000 !important;">
                      <div class="sket-container">
                        ${item.sket_image ? 
                          `<img src="${item.sket_image}" class="sket-image" alt="Sket" 
                            style="max-width: 80%; max-height: 100%; object-fit: contain; border: 1px solid #cccccc;"
                            onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'sket-placeholder\\' style=\\'color: #000000 !important;\\'><span style=\\'color: #000000 !important;\\'>Gambar tidak tersedia</span></div>';">` :
                          `<div class="sket-placeholder" style="color: #000000 !important;">
                            <span style="color: #000000 !important;">Tidak ada sket</span>
                          </div>`
                        }
                      </div>
                    </td>
                    <td class="measurement" style="color: #000000 !important;">${item.panjang_kr || '0'}</td>
                    <td class="measurement" style="color: #000000 !important;">${item.panjang_kn || '0'}</td>
                  </tr>
                `;
              }).join('')}
              
              <!-- Baris total per halaman -->
              <tr class="total-row">
                <td colspan="5" align="center" style="color: #000000 !important;"><strong>TOTAL HALAMAN ${pageIndex + 1}</strong></td>
                <td class="measurement" style="color: #000000 !important;"><strong>${pageTotalKR.toFixed(2)}</strong></td>
                <td class="measurement" style="color: #000000 !important;"><strong>${pageTotalKN.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Keterangan sederhana (tanpa statistik) -->
        <div class="keterangan-sederhana">
          <p style="color: #000000 !important;"><strong>Keterangan:</strong> KR = Kilometer Kanan, KN = Kilometer Kiri</p>
        </div>

        <!-- Tanda Tangan -->
        ${pageIndex === totalPages - 1 ? `
  <!-- Tanda Tangan (HANYA HALAMAN TERAKHIR) -->
  <div class="ttd-container">
    <div class="ttd">
      <div>
        <p style="color: #000000 !important;">Mengetahui,</p>
        <p style="color: #000000 !important;">Kepala UPTD</p>
        <div class="ttd-space"></div>
        <div class="ttd-line"></div>
        <p style="color: #000000 !important;">BUDI RAHMANTO, ST</p>
        <p style="color: #000000 !important;">NIP : 19711009 200212 1 007.</p>
      </div>
      
      <div>
        <p style="color: #000000 !important;">Prajekan, ${formatDate(tanggal)}</p>
        <p style="color: #000000 !important;">Koordinator</p>
        <div class="ttd-space"></div>
        <div class="ttd-line"></div>
        <p style="color: #000000 !important;">SUTRAWI</p>
        <p style="color: #000000 !important;">NIP : 19691004 200701 1 014.</p>
      </div>
    </div>
  </div>
` : ''}

      </body>
      </html>
    `;
  };

  // Generate konten untuk Halaman Foto (PER PEKERJA - SATU ORANG SATU LEMBAR) - mengikuti style LaporanGenerator
  const generateWorkerPhotoPage = (item, workerIndex) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Dokumentasi Foto - ${item.nama}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: "Times New Roman", serif;
            margin: 0;
            padding: 20mm;
            width: 210mm;
            min-height: 297mm;
            background: white;
            color: #000000 !important;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            color: #000000 !important;
          }
          
          .header h3 {
            margin: 4px 0;
            font-size: 16pt;
            color: #000000 !important;
            font-weight: bold;
          }
          
          .header h4 {
            margin: 2px 0;
            font-size: 12pt;
            font-weight: normal;
            color: #000000 !important;
          }
          
          h3.title {
            text-align: center;
            margin: 15px 0 5px 0;
            font-size: 14pt;
            text-decoration: underline;
            color: #000000 !important;
            font-weight: bold;
          }
          
          .info-pekerja {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f2f2f2;
            border: 1px solid #000000;
            color: #000000 !important;
          }
          
          .info-pekerja p {
            margin: 5px 0;
            color: #000000 !important;
            font-size: 11pt;
          }
          
          .info-pekerja strong {
            color: #000000 !important;
            font-weight: bold;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11pt;
            margin-top: 15px;
            color: #000000 !important;
          }
          
          th, td {
            border: 1px solid #000000 !important;
            padding: 8px;
            vertical-align: top;
            text-align: left;
            color: #000000 !important;
          }
          
          th {
            text-align: center;
            background-color: #f2f2f2;
            font-weight: bold;
            color: #000000 !important;
          }
          
          td {
            color: #000000 !important;
          }
          
          .foto-container {
            width: 100%;
            height: 120px;
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f8f8;
          }
          
          .foto-placeholder {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000000 !important;
            font-size: 10pt;
            border: 1px solid #cccccc;
          }
          
          .foto-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border: 1px solid #cccccc;
            display: block;
            margin: 0 auto;
          }
          
          .progress-percent {
            text-align: center;
            font-weight: bold;
            font-size: 12pt;
            color: #000000 !important;
          }
          
          .keterangan {
            margin-top: 30px;
            font-size: 10pt;
            line-height: 1.5;
            color: #000000 !important;
          }
          
          .keterangan p {
            color: #000000 !important;
          }
          
          .keterangan strong {
            color: #000000 !important;
            font-weight: bold;
          }
          
          .ttd-container {
            margin-top: 40px;
            width: 100%;
          }
          
          .ttd {
            display: flex;
            justify-content: space-between;
            font-size: 11pt;
            color: #000000 !important;
          }
          
          .ttd > div {
            width: 45%;
            text-align: center;
            color: #000000 !important;
          }
          
          .ttd-space {
            height: 60px;
            margin: 5px 0;
          }
          
          .ttd-line {
            width: 180px;
            height: 1px;
            background: #000000 !important;
            margin: 30px auto 5px auto;
          }
          
          .page-number {
            position: absolute;
            bottom: 15mm;
            right: 20mm;
            font-size: 10pt;
            color: #000000 !important;
          }
          
          .wrap-text {
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            overflow-wrap: break-word;
          }
          
          p, span, div, h1, h2, h3, h4, h5, h6, li {
            color: #000000 !important;
          }
          
          @media print {
            body {
              padding: 20mm;
              width: 210mm;
              min-height: 297mm;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body style="color: #000000 !important;">
        <div class="header">
          <h3 style="color: #000000 !important;">UNIT PELAKSANA TEKNIS BINA MARGA</h3>
          <h3 style="color: #000000 !important;">WILAYAH PRAJEKAN</h3>
        </div>

        <h3 class="title" style="color: #000000 !important;">FOTO LOKASI</h3>
        <h4 style="text-align: center; margin: 5px 0; color: #000000 !important;">WILAYAH ${item.wilayah_penugasan?.toUpperCase() || wilayah.toUpperCase()}</h4>
        <h4 style="text-align: center; margin: 5px 0; color: #000000 !important;">Tanggal : ${formatDate(item.tanggal) || formatDate(tanggal)}</h4>
        <h4 style="text-align: center; margin: 5px 0 20px 0; color: #000000 !important;">Ruas : ${item.ruas_jalan || '-'}</h4>

        <table>
          <thead>
            <tr>
              <th width="80%" style="color: #000000 !important;">FOTO</th>
              <th width="20%" style="color: #000000 !important;">PROGRESS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="foto-container">
                  ${item.foto_0 ? 
                    `<img src="${item.foto_0}" class="foto-img" alt="Foto 0%" style="border-color: #cccccc;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'foto-placeholder\\' style=\\'color: #000000 !important;\\'><span style=\\'color: #000000 !important;\\'>FOTO 0% - Tidak tersedia</span></div>';">` :
                    `<div class="foto-placeholder" style="color: #000000 !important;">
                      <span style="color: #000000 !important;">FOTO 0% - Kondisi awal lokasi</span>
                    </div>`
                  }
                </div>
              </td>
              <td class="progress-percent" style="color: #000000 !important;">0 %</td>
            </tr>
            <tr>
              <td>
                <div class="foto-container">
                  ${item.foto_50 ? 
                    `<img src="${item.foto_50}" class="foto-img" alt="Foto 50%" style="border-color: #cccccc;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'foto-placeholder\\' style=\\'color: #000000 !important;\\'><span style=\\'color: #000000 !important;\\'>FOTO 50% - Tidak tersedia</span></div>';">` :
                    `<div class="foto-placeholder" style="color: #000000 !important;">
                      <span style="color: #000000 !important;">FOTO 50% - Progress tengah pekerjaan</span>
                    </div>`
                  }
                </div>
              </td>
              <td class="progress-percent" style="color: #000000 !important;">50 %</td>
            </tr>
            <tr>
              <td>
                <div class="foto-container">
                  ${item.foto_100 ? 
                    `<img src="${item.foto_100}" class="foto-img" alt="Foto 100%" style="border-color: #cccccc;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'foto-placeholder\\' style=\\'color: #000000 !important;\\'><span style=\\'color: #000000 !important;\\'>FOTO 100% - Tidak tersedia</span></div>';">` :
                    `<div class="foto-placeholder" style="color: #000000 !important;">
                      <span style="color: #000000 !important;">FOTO 100% - Pekerjaan selesai</span>
                    </div>`
                  }
                </div>
              </td>
              <td class="progress-percent" style="color: #000000 !important;">100 %</td>
            </tr>
          </tbody>
        </table>

        <div class="keterangan">
          <p style="color: #000000 !important;"><strong style="color: #000000 !important;">Keterangan:</strong></p>
          <p style="color: #000000 !important;">1. Foto 0% : Kondisi awal lokasi sebelum pekerjaan</p>
          <p style="color: #000000 !important;">2. Foto 50% : Kondisi saat pekerjaan sedang berlangsung</p>
          <p style="color: #000000 !important;">3. Foto 100% : Kondisi setelah pekerjaan selesai</p>
          <p style="margin-top: 10px; color: #000000 !important;">
            <strong style="color: #000000 !important;">Pegawai:</strong> 
            <span class="wrap-text">${item.nama || '-'}</span>
          </p>
          <p style="color: #000000 !important;">
            <strong style="color: #000000 !important;">Kegiatan:</strong> 
            <span class="wrap-text">${item.kegiatan || '-'}</span>
          </p>
        </div>

      </body>
      </html>
    `;
  };

  const renderToCanvas = async (htmlContent, pageNumber, isLandscape = false) => {
    try {
      // Create temporary container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = isLandscape ? '297mm' : '210mm';
      container.style.padding = isLandscape ? '15mm 10mm' : '20mm';
      container.style.boxSizing = 'border-box';
      container.style.background = 'white';
      container.style.color = '#000000';
      container.innerHTML = htmlContent;
      
      // Append to body temporarily
      document.body.appendChild(container);

      // Force black color for all elements
      const allElements = container.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.color = '#000000';
        el.style.setProperty('color', '#000000', 'important');
      });

      // Generate canvas dengan konfigurasi untuk teks hitam
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
          // Force semua teks menjadi hitam
          const allClonedElements = clonedDoc.querySelectorAll('*');
          allClonedElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const color = computedStyle.color;
            
            // Jika warna bukan hitam, ubah ke hitam
            if (color !== 'rgb(0, 0, 0)' && !el.tagName.includes('IMG')) {
              el.style.color = '#000000';
              el.style.setProperty('color', '#000000', 'important');
            }
            
            // Force text color untuk semua element
            el.style.webkitPrintColorAdjust = 'exact';
            el.style.printColorAdjust = 'exact';
            el.style.colorAdjust = 'exact';
          });

          // Handle images dengan lebih baik
          const images = clonedDoc.querySelectorAll('img');
          images.forEach(img => {
            // Pastikan gambar dimuat dengan CORS
            img.crossOrigin = 'anonymous';
            
            if (!img.complete) {
              img.onload = () => {
                // Gambar berhasil dimuat
              };
              img.onerror = () => {
                img.style.display = 'none';
                const placeholder = clonedDoc.createElement('div');
                placeholder.style.width = '100%';
                placeholder.style.height = '100%';
                placeholder.style.background = '#f0f0f0';
                placeholder.style.display = 'flex';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.color = '#000000';
                placeholder.style.border = '1px solid #cccccc';
                placeholder.innerText = 'Gambar tidak tersedia';
                img.parentNode.replaceChild(placeholder, img);
              };
            }
          });
        }
      });

      // Remove container
      document.body.removeChild(container);

      return canvas;
    } catch (error) {
      console.error(`Error rendering page ${pageNumber}:`, error);
      throw error;
    }
  };

  const downloadPage1PDF = async () => {
    if (!data || data.length === 0) return;
    
    setDownloading(true);
    setDownloadProgress(0);
    setError(null);

    try {
      // Bagi data menjadi beberapa halaman (3 baris per halaman)
      const dataPages = chunkDataForPages(data, 3);
      const totalPages = dataPages.length;
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Render setiap halaman
      for (let i = 0; i < dataPages.length; i++) {
        const pageData = dataPages[i];
        const htmlContent = generatePage1Content(pageData, i, totalPages);
        const canvas = await renderToCanvas(htmlContent, i + 1, true);
        
        const imgWidth = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage('landscape');
        }
        
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        
        // Update progress
        setDownloadProgress(Math.round(((i + 1) / dataPages.length) * 100));
      }
      
      setDownloadProgress(100);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const safeWilayah = wilayah.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-') || 'semua-wilayah';
      const safeDate = formatDateShort(tanggal).replace(/\//g, '-');
      const fileName = `rekap-tabel-${safeWilayah}-${safeDate}.pdf`;
      
      pdf.save(fileName);
      
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Gagal membuat PDF. Pastikan koneksi internet stabil dan coba lagi.');
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const downloadPage2PDF = async () => {
    if (!data || data.length === 0) return;
    
    setDownloading(true);
    setDownloadProgress(0);
    setError(null);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Filter hanya data yang memiliki foto
      const dataWithPhotos = data.filter(item => 
        item.foto_0 || item.foto_50 || item.foto_100 || item.sket_image
      );

      if (dataWithPhotos.length === 0) {
        setError('Tidak ada data dengan foto untuk didownload');
        setDownloading(false);
        return;
      }

      // Render setiap pekerja sebagai halaman terpisah
      for (let i = 0; i < dataWithPhotos.length; i++) {
        const item = dataWithPhotos[i];
        const htmlContent = generateWorkerPhotoPage(item, i);
        const canvas = await renderToCanvas(htmlContent, i + 1, false);
        
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage('portrait');
        }
        
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        
        // Update progress
        setDownloadProgress(Math.round(((i + 1) / dataWithPhotos.length) * 100));
      }
      
      setDownloadProgress(100);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const safeWilayah = wilayah.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-') || 'semua-wilayah';
      const safeDate = formatDateShort(tanggal).replace(/\//g, '-');
      const fileName = `foto-pekerja-${safeWilayah}-${safeDate}.pdf`;
      
      pdf.save(fileName);
      
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Gagal membuat PDF. Pastikan koneksi internet stabil dan coba lagi.');
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleBulkDownload = async () => {
    const downloads = [];
    
    if (selectedFormats.halaman1) downloads.push(downloadPage1PDF());
    if (selectedFormats.halaman2) downloads.push(downloadPage2PDF());
    
    try {
      setDownloading(true);
      setDownloadProgress(0);
      setError(null);
      
      for (let i = 0; i < downloads.length; i++) {
        await downloads[i];
        setDownloadProgress(((i + 1) / downloads.length) * 100);
      }
      
    } catch (error) {
      console.error('Error in bulk download:', error);
      setError('Terjadi kesalahan saat mengunduh file.');
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  const toggleFormat = (format) => {
    setSelectedFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const selectAllFormats = () => {
    setSelectedFormats({
      halaman1: true,
      halaman2: true
    });
  };

  const deselectAllFormats = () => {
    setSelectedFormats({
      halaman1: false,
      halaman2: false
    });
  };

  const getSelectedCount = () => {
    return Object.values(selectedFormats).filter(v => v).length;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <FileText className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-500 text-center">Tidak ada data untuk rekap</p>
        <p className="text-sm text-gray-400 mt-1">Pilih tanggal dan wilayah yang memiliki data</p>
      </div>
    );
  }

  // Hitung statistik untuk ditampilkan di UI saja
  const totalKR = data.reduce((sum, item) => sum + (parseFloat(item.panjang_kr) || 0), 0);
  const totalKN = data.reduce((sum, item) => sum + (parseFloat(item.panjang_kn) || 0), 0);
  const uniquePegawai = [...new Set(data.map(item => item.nama))].length;
  const hasPhotos = data.some(item => item.foto_0 || item.foto_50 || item.foto_100 || item.sket_image);
  const dataWithPhotosCount = data.filter(item => item.foto_0 || item.foto_50 || item.foto_100 || item.sket_image).length;
  const totalPages = Math.ceil(data.length / 3);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Download Rekap Laporan</h3>
          <p className="text-sm text-blue-600 mt-1">
            {wilayah} • {formatDate(tanggal)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {data.length} data dari {uniquePegawai} pekerja • Total KR: {totalKR.toFixed(2)} m • Total KN: {totalKN.toFixed(2)} m
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Tabel akan terbagi menjadi {totalPages} halaman (3 baris per halaman)
          </p>
          <p className="text-xs text-gray-400">
            Foto: {dataWithPhotosCount} pekerja dengan dokumentasi (masing-masing 1 halaman)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${downloading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-xs text-gray-500">
            {downloading ? 'Memproses...' : 'Siap diunduh'}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {downloading && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress download</span>
            <span>{Math.round(downloadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Membuat PDF dengan teks hitam...
          </p>
        </div>
      )}

      {/* Format Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Pilih Format PDF</h4>
          <div className="flex gap-2">
            <button
              onClick={selectAllFormats}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Pilih Semua
            </button>
            <button
              onClick={deselectAllFormats}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hapus Semua
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Halaman 1 - Tabel Rekap */}
          <button
            onClick={() => toggleFormat('halaman1')}
            disabled={downloading}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedFormats.halaman1 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${downloading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                selectedFormats.halaman1 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300'
              }`}>
                {selectedFormats.halaman1 && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Tabel Rekap (Landscape)</p>
                <p className="text-xs text-gray-500">Hasil kerja semua pekerja</p>
                <p className="text-xs text-blue-600 mt-1">✓ Tanpa kolom Tanggal</p>
                <p className="text-xs text-blue-600">✓ Kolom SKET sangat besar</p>
                <p className="text-xs text-blue-600">✓ 3 baris per halaman</p>
                <p className="text-xs text-blue-600">✓ Keterangan "Panjang" di atas KR/KN</p>
                <p className="text-xs text-gray-400 mt-1">Total {totalPages} halaman</p>
              </div>
            </div>
          </button>

          {/* Halaman 2 - Foto Per Pekerja (style LaporanGenerator) */}
          <button
            onClick={() => toggleFormat('halaman2')}
            disabled={downloading || !hasPhotos}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedFormats.halaman2 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            } ${downloading ? 'opacity-50 cursor-not-allowed' : ''} ${!hasPhotos ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                selectedFormats.halaman2 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300'
              }`}>
                {selectedFormats.halaman2 && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Dokumentasi Foto</p>
                <p className="text-xs text-gray-500">1 pekerja = 1 halaman</p>
                {!hasPhotos ? (
                  <p className="text-xs text-red-500 mt-1">Tidak ada foto</p>
                ) : (
                  <>
                    <p className="text-xs text-green-600 mt-1">✓ {dataWithPhotosCount} pekerja dengan foto</p>
                    <p className="text-xs text-green-600">✓ Masing-masing 1 halaman</p>
                    <p className="text-xs text-green-600">✓ Tabel foto progress (0%, 50%, 100%)</p>
                    <p className="text-xs text-gray-400 mt-1">Total {dataWithPhotosCount} halaman</p>
                  </>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Download Button */}
      <div className="mb-6">
        <button
          onClick={handleBulkDownload}
          disabled={downloading || getSelectedCount() === 0}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {downloading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses {getSelectedCount()} PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download {getSelectedCount()} File PDF Terpilih
            </>
          )}
        </button>
        
        {getSelectedCount() > 0 && !downloading && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Akan mengunduh {getSelectedCount()} file PDF
          </p>
        )}
      </div>

      {/* Individual Download Buttons */}
      <div className="mb-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Download Per Format</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={downloadPage1PDF}
            disabled={downloading}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:border-blue-300 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg border border-blue-200 flex items-center justify-center group-hover:border-blue-300">
                <TableIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Tabel Rekap</p>
                <p className="text-xs text-gray-500">{data.length} baris data • {totalPages} halaman</p>
                <p className="text-xs text-blue-600">3 baris/halaman, SKET besar</p>
              </div>
            </div>
            <FileOutput className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
          </button>

          <button
            onClick={downloadPage2PDF}
            disabled={downloading || !hasPhotos}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:border-green-300 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg border border-green-200 flex items-center justify-center group-hover:border-green-300">
                <ImageIcon className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Foto Per Pekerja</p>
                <p className="text-xs text-gray-500">{dataWithPhotosCount} pekerja • {dataWithPhotosCount} halaman</p>
                <p className="text-xs text-green-600">Tabel foto progress</p>
              </div>
            </div>
            <FileOutput className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
          </button>
        </div>
      </div>

      {/* Preview Information */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs text-blue-600 font-bold">i</span>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <strong>Format Rekap Kinerja - 3 Baris per Halaman + Foto Per Pekerja</strong>
            </p>
            <div className="mt-3 text-xs text-gray-600">
              <p><strong>Halaman 1 - Tabel Rekap (Landscape):</strong></p>
              <ul className="mt-1 space-y-1">
                <li>• Kolom: NO, NAMA, RUAS JALAN, KEGIATAN, SKET LOKASI, KR, KN</li>
                <li>• Kolom TANGGAL dihilangkan untuk ruang lebih besar</li>
                <li>• Kolom SKET diperbesar SANGAT BESAR (lebar 23%, tinggi 90px)</li>
                <li>• <strong>3 baris data per halaman</strong> agar TTD tidak kepotong</li>
                <li>• Keterangan "PANJANG (Meter)" di atas kolom KR dan KN</li>
                <li>• Total halaman tabel: {totalPages} halaman</li>
              </ul>
              <p className="mt-2"><strong>Halaman Foto - Per Pekerja:</strong></p>
              <ul className="mt-1 space-y-1">
                <li>• Setiap pekerja mendapat 1 halaman terpisah</li>
                <li>• Tabel foto progress: Foto 0%, 50%, 100%</li>
                <li>• Informasi lengkap: Nama, Jabatan, Wilayah, Ruas Jalan</li>
                <li>• Detail kegiatan dan pengukuran KR/KN</li>
                <li>• Total halaman foto: {dataWithPhotosCount} halaman</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}