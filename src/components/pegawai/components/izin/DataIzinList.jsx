"use client";

import { Plus, Filter } from "lucide-react";
import { IzinCard } from "./IzinCard";
import { FilterSection } from "./FilterSection";
import { EmptyState } from "./EmptyState";

export function DataIzinList({
  data,
  totalData,
  userInfo,
  loading,
  selectedMonth,
  selectedYear,
  showFilter,
  isFilterActive,
  onMonthChange,
  onYearChange,
  onToggleFilter,
  onResetFilter,
  onNewRequest,
  onEdit,
  onRefresh,
  getAvailableMonths,
  getAvailableYears,
  getMonthName
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Data Pengajuan Izin
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {userInfo ? `Pengajuan izin untuk ${userInfo.name}` : 'Kelola dan lacak pengajuan izin'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onNewRequest}
            className="flex-1 flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajukan Izin Baru
          </button>
          
          <FilterSection
            showFilter={showFilter}
            isFilterActive={isFilterActive}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}
            onToggleFilter={onToggleFilter}
            onResetFilter={onResetFilter}
            getAvailableMonths={getAvailableMonths}
            getAvailableYears={getAvailableYears}
            getMonthName={getMonthName}
          />
        </div>
      </div>

      {/* Filter Info */}
      {isFilterActive && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-700">
                Filter aktif:{" "}
                <strong>
                  {selectedMonth && selectedYear 
                    ? `${getMonthName(selectedMonth)} ${selectedYear}`
                    : selectedMonth 
                    ? `${getMonthName(selectedMonth)}`
                    : selectedYear 
                    ? `Tahun ${selectedYear}`
                    : ""
                  }
                </strong>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-700">
                {data.length} data ditemukan
              </span>
              <button
                onClick={onResetFilter}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Hapus Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-sm mt-3">Memuat data izin...</p>
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          isFilterActive={isFilterActive}
          onNewRequest={onNewRequest}
          onRefresh={onRefresh}
        />
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-2">
            Menampilkan {data.length} dari {totalData} pengajuan
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.map((item) => (
              <IzinCard
                key={item.id}
                izin={item}
                userInfo={userInfo}
                onEdit={() => onEdit(item)}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}