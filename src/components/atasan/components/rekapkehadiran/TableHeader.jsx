"use client";

export function TableHeader({ daysInMonth }) {
  return (
    <thead>
      <tr className="bg-gray-50">
        <th rowSpan={2} className="border border-gray-300 p-2 font-semibold text-center w-12">NO</th>
        <th rowSpan={2} className="border border-gray-300 p-2 font-semibold text-left min-w-[150px] md:min-w-[200px]">NAMA</th>
        <th rowSpan={2} className="border border-gray-300 p-2 font-semibold text-left min-w-[120px] md:min-w-[150px]">JABATAN</th>
        <th colSpan={daysInMonth} className="border border-gray-300 p-2 font-semibold text-center">
          TANGGAL
        </th>
        <th colSpan={4} className="border border-gray-300 p-2 font-semibold text-center">
          JUMLAH
        </th>
      </tr>
      <tr className="bg-gray-50">
        {/* Header tanggal (1-31) */}
        {Array.from({length: daysInMonth}, (_, i) => (
          <th key={i} className="border border-gray-300 p-1 font-medium text-xs w-6 md:w-8">
            {i + 1}
          </th>
        ))}
        <th className="border border-gray-300 p-1 font-medium bg-green-50 w-8">H</th>
        <th className="border border-gray-300 p-1 font-medium bg-amber-50 w-8">T</th>
        <th className="border border-gray-300 p-1 font-medium bg-purple-50 w-8">I</th>
        <th className="border border-gray-300 p-1 font-medium bg-red-50 w-8">TK</th>
      </tr>
    </thead>
  );
}