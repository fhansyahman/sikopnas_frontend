"use client";

import { IzinTable } from "./IzinTable";
import { EmptyState } from "./EmptyState";
import { ErrorAlert } from "./ErrorAlert";

export function DataTab({
  izinList,
  filteredIzin,
  statistik,
  tanggalFilter,
  error,
  selectedItems,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onUpdateStatus,
  onRefresh,
  onSetToday
}) {
  return (
    <div>
      {error && <ErrorAlert error={error} onRetry={onRefresh} />}
      
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Menampilkan {filteredIzin.length} dari {izinList.length} data
            {tanggalFilter && ` untuk tanggal ${tanggalFilter}`}
          </p>
        </div>
        <div className="text-sm text-gray-600">
          <span className="inline-flex items-center gap-1 mr-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Disetujui: {statistik.disetujui}
          </span>
          <span className="inline-flex items-center gap-1 mr-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            Ditolak: {statistik.ditolak}
          </span>
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            Pending: {statistik.pending}
          </span>
        </div>
      </div>
      
      <IzinTable
        filteredIzin={filteredIzin}
        selectedItems={selectedItems}
        onToggleSelect={onToggleSelect}
        onToggleSelectAll={onToggleSelectAll}
        onViewDetail={onViewDetail}
        onUpdateStatus={onUpdateStatus}
      />

      {filteredIzin.length === 0 && (
        <EmptyState
          type={izinList.length === 0 ? "empty" : "no-filter"}
          onRefresh={onRefresh}
          onSetToday={onSetToday}
        />
      )}
    </div>
  );
}