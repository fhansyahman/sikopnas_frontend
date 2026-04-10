"use client";

import { Plus } from "lucide-react";
import { FilterSection } from "./FilterSection";
import { KinerjaCard } from "./KinerjaCard";
import { EmptyState } from "./EmptyState";

export function KinerjaList({
  data,
  totalData,
  loading,
  selectedMonth,
  selectedYear,
  searchTerm,
  availableYears,
  onMonthChange,
  onYearChange,
  onSearchChange,
  onEdit,
  onDelete,
  onRefresh,
  onNewRequest,
  onImageClick,
  formatDate
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Data Kinerja Harian</h2>
          <p className="text-slate-500 text-sm mt-1">Daftar laporan kinerja kerja Anda</p>
        </div>
        <button
          onClick={onNewRequest}
          className="mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kinerja</span>
        </button>
      </div>

      {/* Filter Section */}
      <FilterSection
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        searchTerm={searchTerm}
        availableYears={availableYears}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        onSearchChange={onSearchChange}
      />

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 mt-2">Memuat data kinerja...</p>
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          hasSearch={!!searchTerm}
          onNewRequest={onNewRequest}
          onRefresh={onRefresh}
        />
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-slate-600 mb-2">
            Menampilkan {data.length} dari {totalData} laporan
          </div>
          
          {data.map((item) => (
            <KinerjaCard
              key={item.id}
              item={item}
              onEdit={() => onEdit(item.id)}
              onDelete={() => onDelete(item.id)}
              onImageClick={onImageClick}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}