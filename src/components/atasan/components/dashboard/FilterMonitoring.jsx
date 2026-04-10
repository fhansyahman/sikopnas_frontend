import { Calendar, RefreshCw, Download } from "lucide-react";
import { formatDate } from "../../utils/dashboard/formatters";

export function FilterMonitoring({ selectedDate, onDateChange, onRefresh, onExport, hasData }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6 shadow-sm text-black">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Pilih Tanggal</h2>
          <p className="text-sm text-gray-500">Data akan ditampilkan untuk tanggal yang dipilih</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg">
            <Calendar className="text-blue-500" size={20} />
            <span className="text-sm font-medium text-gray-700">
              {formatDate(selectedDate)}
            </span>
          </div>
          
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={onDateChange}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 w-full md:w-auto"
            />
          </div>
          
          <button
            onClick={onRefresh}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
          
          <button
            onClick={onExport}
            disabled={!hasData}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span>Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}