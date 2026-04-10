'use client';

import { TableRow } from "./TableRow";

export function DetailPeroranganView({ kinerjaList, formatDateShort, onViewDetail, onDownloadPerorangan }) {
  if (kinerjaList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">Tidak ada data kinerja untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Nama Pekerja</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Wilayah</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Ruas Jalan</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Kegiatan</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Pengukuran</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {kinerjaList.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <p className="text-sm text-gray-900">{formatDateShort(item.tanggal)}</p>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{item.nama}</p>
                  <p className="text-xs text-gray-500">{item.jabatan}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <WilayahBadge wilayah={item.wilayah_penugasan} />
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-800">{item.ruas_jalan}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-800 line-clamp-2">{item.kegiatan}</p>
              </td>
              <td className="py-3 px-4">
                <MeasurementInfo kr={item.panjang_kr} kn={item.panjang_kn} />
              </td>
              <td className="py-3 px-4">
                <ActionButtons
                  item={item}
                  onViewDetail={onViewDetail}
                  onDownloadPerorangan={onDownloadPerorangan}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WilayahBadge({ wilayah }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
      {wilayah}
    </span>
  );
}

function MeasurementInfo({ kr, kn }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">KR:</span>
        <span className="font-semibold text-amber-600">{kr}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">KN:</span>
        <span className="font-semibold text-purple-600">{kn}</span>
      </div>
    </div>
  );
}

function ActionButtons({ item, onViewDetail, onDownloadPerorangan }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onViewDetail(item)}
        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Lihat Detail"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => onDownloadPerorangan(item)}
        className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        title="Download PDF Perorangan"
      >
        <FileOutput size={16} />
      </button>
    </div>
  );
}