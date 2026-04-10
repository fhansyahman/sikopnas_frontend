"use client";

export function FilterControls({ 
  tahunFilter, 
  bulanFilter, 
  onTahunChange, 
  onBulanChange, 
  showBulan = true,
  tahunOptions 
}) {
  const bulanOptions = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" }
  ];

  return (
    <>
      <select
        value={tahunFilter}
        onChange={(e) => onTahunChange(parseInt(e.target.value))}
        className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
      >
        {tahunOptions.map(tahun => (
          <option key={tahun} value={tahun}>{tahun}</option>
        ))}
      </select>

      {showBulan && (
        <select
          value={bulanFilter}
          onChange={(e) => onBulanChange(parseInt(e.target.value))}
          className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
        >
          {bulanOptions.map(bulan => (
            <option key={bulan.value} value={bulan.value}>{bulan.label}</option>
          ))}
        </select>
      )}
    </>
  );
}