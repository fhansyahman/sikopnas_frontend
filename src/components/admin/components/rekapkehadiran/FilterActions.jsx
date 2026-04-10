"use client";

import { RefreshCw, Calculator, Printer } from "lucide-react";

export function FilterActions({ onReset, onSetCurrentMonth, showExport, onExport, onPrint }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onSetCurrentMonth}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 border border-gray-300 text-white rounded-lg hover:bg-gray-200 text-sm font-medium shadow-sm flex-1 md:flex-none"
      >
        <RefreshCw size={16} />
        <span className="hidden md:inline">Refresh</span>
      </button>
      
      {showExport && (
        <>
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm flex-1 md:flex-none"
          >
            <Calculator size={16} />
            <span className="hidden md:inline">Excel</span>
          </button>
          
          <button
            onClick={onPrint}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium shadow-sm flex-1 md:flex-none"
          >
            <Printer size={16} />
            <span className="hidden md:inline">Cetak</span>
          </button>
        </>
      )}
    </div>
  );
}