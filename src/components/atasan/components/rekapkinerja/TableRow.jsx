'use client';

import { Eye, FileOutput } from "lucide-react";

export function TableRow({ item, onViewDetail, onDownloadPerorangan }) {
  return (
    <tr className="hover:bg-white transition-colors">
      <td className="py-3 px-4">
        <div>
          <p className="font-medium text-gray-900">{item.nama}</p>
          <p className="text-xs text-gray-500">{item.jabatan}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-gray-800">{item.ruas_jalan}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-gray-800 line-clamp-2">{item.kegiatan}</p>
      </td>
      <td className="py-3 px-4">
        <span className="font-semibold text-amber-600">{item.panjang_kr}</span>
      </td>
      <td className="py-3 px-4">
        <span className="font-semibold text-purple-600">{item.panjang_kn}</span>
      </td>
      <td className="py-3 px-4">
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
      </td>
    </tr>
  );
}