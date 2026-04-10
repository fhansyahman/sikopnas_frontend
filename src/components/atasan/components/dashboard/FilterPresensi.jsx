import { RefreshButton } from "./RefreshButton";
import { ExportButton } from "./ExportButton";

export function FilterPresensi({
  selectedMonth,
  selectedYear,
  selectedWilayah,
  loading,
  bulanOptions,
  tahunOptions,
  onMonthChange,
  onYearChange,
  onWilayahChange,
  onRefresh,
  onExportChart,
  onExportData,
  chartData
}) {
  const WILAYAH_LIST = ['Cermee', 'Botolinggo', 'Prajekan', 'Klabang', 'Ijen'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6 shadow-sm text-black">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filter Data Grafik Kehadiran</h3>
          <p className="text-sm text-gray-600">Pilih periode dan wilayah untuk visualisasi data presensi</p>
        </div>
        
        <div className="flex items-center gap-2">
          <ExportButton onClick={onExportChart} disabled={!chartData} label="Export Chart" />
          <ExportButton onClick={onExportData} disabled={!chartData} label="Export Data" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
          >
            {bulanOptions.map(bulan => (
              <option key={bulan.value} value={parseInt(bulan.value)}>{bulan.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
          >
            {tahunOptions.map(tahun => (
              <option key={tahun} value={parseInt(tahun)}>{tahun}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wilayah</label>
          <select
            value={selectedWilayah}
            onChange={(e) => onWilayahChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
          >
            <option value="all">Semua Wilayah</option>
            {WILAYAH_LIST.map(wilayah => (
              <option key={wilayah} value={wilayah}>{wilayah}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <RefreshButton onClick={onRefresh} loading={loading} />
        </div>
      </div>
    </div>
  );
}