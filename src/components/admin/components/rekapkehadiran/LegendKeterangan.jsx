"use client";

export function LegendKeterangan() {
  const items = [
    { status: 'H', label: 'Hadir', desc: 'Hadir tepat waktu', color: 'bg-green-100 text-green-800 border-green-200' },
    { status: 'T', label: 'Terlambat', desc: 'Hadir terlambat', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { status: 'I', label: 'Izin', desc: 'Tidak hadir dengan izin', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { status: 'TK', label: 'Tanpa Keterangan', desc: 'Tidak hadir tanpa izin', color: 'bg-red-100 text-red-800 border-red-200' }
  ];

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-2">Keterangan:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${item.color}`}>
              {item.status}
            </div>
            <div>
              <span className="text-sm text-gray-600">{item.label}</span>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}