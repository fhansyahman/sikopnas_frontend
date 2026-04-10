"use client";

import { KinerjaTable } from "./KinerjaTable";
import { EmptyState } from "./EmptyState";

export function DataKinerjaTab({
  kinerjaList,
  filteredKinerja,
  loading,
  error,
  selectedItems,
  setSelectedItems,
  startDateFilter,
  endDateFilter,
  statistik,
  onRefresh,
  onViewDetail,
  onDownload,
  onEdit,
  onDelete,
  onToggleSelect,
  onSelectAll
}) {
  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <p className="text-sm text-gray-600">
            Menampilkan {filteredKinerja.length} dari {kinerjaList.length} data
            {startDateFilter && endDateFilter && ` periode ${startDateFilter} - ${endDateFilter}`}
          </p>
        </div>
        <div className="text-sm text-gray-600 flex gap-3">
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            Total: {statistik.total_laporan}
          </span>
          <span className="inline-flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Pegawai: {statistik.total_pegawai}
          </span>
        </div>
      </div>
      
      <KinerjaTable
        filteredKinerja={filteredKinerja}
        selectedItems={selectedItems}
        onToggleSelect={onToggleSelect}
        onSelectAll={onSelectAll}
        onViewDetail={onViewDetail}
        onDownload={onDownload}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {filteredKinerja.length === 0 && (
        <EmptyState
          hasFilters={!!(startDateFilter && endDateFilter)}
          onSetCurrentMonth={() => {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            onRefresh({
              start_date: firstDay.toISOString().split('T')[0],
              end_date: lastDay.toISOString().split('T')[0]
            });
          }}
        />
      )}
    </div>
  );
}