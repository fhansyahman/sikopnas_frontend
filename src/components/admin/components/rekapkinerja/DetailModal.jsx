'use client';

import { ModalWrapper } from "./ModalWrapper";

export function DetailModal({ isOpen, onClose, data, formatDate, onDownload }) {
  if (!data) return null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Kinerja"
      subtitle={data.nama}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <InfoCard title="Informasi Pekerja">
          <InfoRow label="Nama" value={data.nama} />
          <InfoRow label="Jabatan" value={data.jabatan} />
          <InfoRow label="Wilayah" value={data.wilayah_penugasan} />
          <InfoRow label="Tanggal" value={formatDate(data.tanggal)} />
        </InfoCard>

        <InfoCard title="Informasi Kinerja">
          <InfoRow label="Ruas Jalan" value={data.ruas_jalan} />
          <InfoRow label="Kegiatan" value={data.kegiatan} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Panjang KR</p>
              <p className="font-bold text-amber-600 text-lg">{data.panjang_kr} m</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Panjang KN</p>
              <p className="font-bold text-purple-600 text-lg">{data.panjang_kn} m</p>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Dokumentasi Foto */}
      {(data.foto_0 || data.foto_50 || data.foto_100 || data.sket_image) && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Dokumentasi Foto</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.foto_0 && <PhotoItem label="Foto 0%" src={data.foto_0} />}
            {data.foto_50 && <PhotoItem label="Foto 50%" src={data.foto_50} />}
            {data.foto_100 && <PhotoItem label="Foto 100%" src={data.foto_100} />}
            {data.sket_image && <PhotoItem label="Sket Lokasi" src={data.sket_image} />}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Tutup
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700"
        >
          Download PDF
        </button>
      </div>
    </ModalWrapper>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 md:p-5">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}

function PhotoItem({ label, src }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
      <img src={src} alt={label} className="w-full h-32 object-cover rounded-lg" />
    </div>
  );
}