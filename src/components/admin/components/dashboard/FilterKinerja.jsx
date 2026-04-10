"use client";

import { RefreshCw } from "lucide-react";

export function FilterKinerja({
  selectedMonth,
  selectedYear,
  loading,
  onMonthChange,
  onYearChange,
  onRefresh
}) {
  const currentYear = new Date().getFullYear();
  const tahunOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const getNamaBulan = (month) => {
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return bulan[parseInt(month) - 1] || '';
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    console.log('📅 Bulan dipilih:', value);
    onMonthChange(parseInt(value));
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    console.log('📅 Tahun dipilih:', value);
    onYearChange(parseInt(value));
  };

  const handleRefresh = () => {
    console.log('🔄 Refresh data kinerja');
    onRefresh();
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-black">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pilih Periode Bulanan</h3>
            <p className="text-sm text-gray-600">Pilih bulan dan tahun untuk melihat data pemantauan kinerja</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Select Bulan */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[140px]"
                disabled={loading}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {getNamaBulan(month)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Select Tahun */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[100px]"
                disabled={loading}
              >
                {tahunOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* Tombol Refresh */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Info Periode yang Dipilih */}
        <div className="mt-3 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
          <span className="font-medium">Periode aktif:</span> {getNamaBulan(selectedMonth)} {selectedYear}
        </div>
      </div>
    </div>
  );
}