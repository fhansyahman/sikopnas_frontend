"use client";

export function TableFooter({ daysInMonth, statistik }) {
  return (
    <tr className="bg-gray-50 font-bold">
      <td colSpan={3} className="border border-gray-300 p-2 text-right">
        TOTAL
      </td>
      {/* Kosong untuk kolom tanggal */}
      {Array.from({length: daysInMonth}, (_, i) => (
        <td key={i} className="border border-gray-300 p-1"></td>
      ))}
      <td className="border border-gray-300 p-2 text-center bg-green-100">
        {statistik.totalHadir}
      </td>
      <td className="border border-gray-300 p-2 text-center bg-amber-100">
        {statistik.totalTerlambat}
      </td>
      <td className="border border-gray-300 p-2 text-center bg-purple-100">
        {statistik.totalIzin}
      </td>
      <td className="border border-gray-300 p-2 text-center bg-red-100">
        {statistik.totalTanpaKeterangan}
      </td>
    </tr>
  );
}