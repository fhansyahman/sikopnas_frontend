"use client";

import { CalendarDays, RefreshCw } from "lucide-react";
import { FilterControls } from "./FilterControls";
import { EmptyState } from "./EmptyState";

export function KalenderTab({
  kalender,
  tahunFilter,
  bulanFilter,
  onTahunChange,
  onBulanChange,
  onRefresh,
  getHariStatus,
  tahunOptions
}) {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <FilterControls
          tahunFilter={tahunFilter}
          bulanFilter={bulanFilter}
          onTahunChange={onTahunChange}
          onBulanChange={onBulanChange}
          showBulan={true}
          tahunOptions={tahunOptions}
        />
        
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium shadow-sm flex-1 md:flex-none"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          
        </div>
      </div>

      {kalender.length === 0 ? (
        <EmptyState 
          icon={<CalendarDays className="w-8 h-8 text-gray-400" />}
          message="Tidak ada data kalender untuk periode yang dipilih"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kalender.map((hari) => {
            const status = getHariStatus(hari);
            return (
              <div key={hari.tanggal} className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${status.color}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{hari.tanggal_format}</h3>
                    <p className="text-sm text-gray-600 capitalize">{hari.hari}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.textColor}`}>
                    <span>{status.icon}</span>
                    {status.text}
                  </span>
                </div>
                {hari.keterangan && (
                  <p className="text-sm text-gray-700 mt-2 p-2 bg-white/50 rounded-lg">{hari.keterangan}</p>
                )}
                {hari.is_custom && (
                  <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                    <span>✓</span>
                    Custom Setting
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}