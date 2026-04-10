"use client";

import { ModalWrapper, TermSection } from "./ModalWrapper";

export function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const privacyItems = [
    {
      title: "1. Pengumpulan Data",
      content: "Kami mengumpulkan data pribadi yang diperlukan untuk operasional sistem, termasuk nama, jabatan, wilayah penempatan, dan informasi login."
    },
    {
      title: "2. Penggunaan Data",
      content: "Data digunakan untuk keperluan authentikasi, pelacakan aktivitas kerja, dan pelaporan kinerja staff. Data tidak akan digunakan untuk keperluan komersial di luar institusi."
    },
    {
      title: "3. Perlindungan Data",
      content: "Kami menerapkan langkah-langkah keamanan untuk melindungi data pribadi dari akses tidak sah, modifikasi, atau pengungkapan yang tidak diizinkan."
    },
    {
      title: "4. Berbagi Data",
      content: "Data hanya akan dibagikan dalam lingkungan internal UPT Wilayah Prajekan untuk keperluan operasional yang sah dan tidak akan dijual atau disewakan kepada pihak ketiga."
    }
  ];

  return (
    <ModalWrapper onClose={onClose} title="Kebijakan Privasi" size="lg">
      <div className="space-y-4">
        {privacyItems.map((item, index) => (
          <TermSection 
            key={index}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-200">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tutup
        </button>
      </div>
    </ModalWrapper>
  );
}