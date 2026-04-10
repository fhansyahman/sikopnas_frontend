'use client';

import { FileOutput } from "lucide-react";

export function DownloadButtons({ kinerjaList, isGeneratingPDF, onDownloadRekap }) {
  return (
    <div className="w-full flex justify-end">
      <button
        onClick={onDownloadRekap}
        disabled={kinerjaList.length === 0 || isGeneratingPDF}
        className="flex items-center gap-3 px-6 py-4 bg-green-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 text-sm font-semibold"
      >
        <FileOutput size={20} />
        Download Rekap Wilayah (PDF)
      </button>
    </div>
  );
}