"use client";

import { PresensiItem } from "./PresensiItem";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";

export function PresensiList({
  loading,
  allPresensi,
  filteredData,
  expandedDays,
  selectedMonth,
  selectedYear,
  stats,
  onRefresh,
  onSetCurrentMonth,
  onToggleDetail,
  getStatusAkhir,
  getStatusColor,
  getStatusIcon,
  formatDate,
  formatDayOnly,
  formatDayName,
  formatTime,
  getMonthName
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-gray-800">Detail Presensi Harian</h2>
            <p className="text-sm text-gray-500 mt-1">
              {getSubtitle(selectedMonth, selectedYear, getMonthName)}
            </p>
          </div>
          <span className="text-sm text-gray-500">{filteredData.length} hari</span>
        </div>
      </div>

      {renderContent()}
      
      {filteredData.length > 0 && (
        <FooterInfo 
          filteredCount={filteredData.length}
          totalCount={allPresensi.length}
          stats={stats}
        />
      )}
    </div>
  );

  function renderContent() {
    if (loading) return <LoadingState />;
    
    if (allPresensi.length === 0) {
      return <EmptyState 
        type="empty" 
        onRefresh={onRefresh} 
      />;
    }
    
    if (filteredData.length === 0) {
      return <EmptyState 
        type="no-filter" 
        onSetCurrentMonth={onSetCurrentMonth} 
      />;
    }
    
    return (
      <div className="divide-y divide-gray-100">
        {filteredData.map((presensi) => {
          const statusAkhir = presensi.status_akhir || getStatusAkhir(presensi);
          const isExpanded = expandedDays[presensi.id];
          
          return (
            <PresensiItem
              key={presensi.id}
              presensi={presensi}
              statusAkhir={statusAkhir}
              isExpanded={isExpanded}
              onToggleDetail={onToggleDetail}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
              formatDayOnly={formatDayOnly}
              formatDayName={formatDayName}
              formatTime={formatTime}
            />
          );
        })}
      </div>
    );
  }
}

function getSubtitle(selectedMonth, selectedYear, getMonthName) {
  if (selectedMonth && selectedYear) {
    return `Data presensi ${getMonthName(selectedMonth)} ${selectedYear}`;
  }
  if (!selectedMonth && !selectedYear) {
    return "Semua data presensi Anda";
  }
  return "Data presensi berdasarkan filter";
}

function FooterInfo({ filteredCount, totalCount, stats }) {
  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600">
        <div>
          <p>Menampilkan {filteredCount} dari {totalCount} total presensi</p>
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          {stats.hadir_pemutihan > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>Pemutihan: {stats.hadir_pemutihan}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Hadir: {stats.hadir}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Izin: {stats.izin + stats.sakit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}