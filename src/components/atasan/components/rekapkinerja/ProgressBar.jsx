'use client';

export function ProgressBar({ progress, type, totalFiles }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress download</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {type === 'rekap' 
          ? 'Membuat PDF rekap wilayah...' 
          : `Mendownload ${totalFiles} file PDF perorangan...`}
      </p>
    </div>
  );
}