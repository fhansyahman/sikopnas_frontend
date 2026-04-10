"use client";

import { ModalWrapper, TermSection } from "./ModalWrapper";

export function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const terms = [
    {
      title: "1. Penggunaan Aplikasi",
      content: "Aplikasi ini ditujukan untuk penggunaan internal staff UPT Wilayah Prajekan. Setiap pengguna bertanggung jawab atas aktivitas yang dilakukan melalui akun masing-masing."
    },
    {
      title: "2. Kewajiban Pengguna",
      content: "Pengguna wajib menjaga kerahasiaan password dan tidak memberikan akses akun kepada pihak lain. Segala aktivitas yang dilakukan melalui akun pengguna menjadi tanggung jawab pemilik akun."
    },
    {
      title: "3. Data dan Informasi",
      content: "Data yang dimasukkan ke dalam sistem harus akurat dan sesuai dengan kondisi lapangan. Pengguna dilarang memanipulasi data atau memberikan informasi yang menyesatkan."
    },
    {
      title: "4. Hak Akses",
      content: "Hak akses pengguna ditentukan berdasarkan jabatan dan wilayah penempatan. Pengguna tidak diperbolehkan mengakses data di luar wilayah kerjanya tanpa izin yang sah."
    }
  ];

  return (
    <ModalWrapper onClose={onClose} title="Ketentuan Layanan" size="lg">
      <div className="space-y-4">
        {terms.map((term, index) => (
          <TermSection 
            key={index}
            title={term.title}
            content={term.content}
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