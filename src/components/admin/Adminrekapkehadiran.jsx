"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./components/rekapkehadiran/Sidebar";
import { Header } from "./components/rekapkehadiran/Header";
import { FilterBar } from "./components/rekapkehadiran/FilterBar";
import { TabNavigation } from "./components/rekapkehadiran/TabNavigation";
import { RekapTab } from "./components/rekapkehadiran/RekapTab";
import { StatistikTab } from "./components/rekapkehadiran/StatistikTab";
import { LoadingState } from "./components/rekapkehadiran/LoadingState";
import { usePresensiData } from "./hooks/rekapkehadiran/usePresensiData";
import { useFilters } from "./hooks/rekapkehadiran/useFilters";
import { useRekapProcessor } from "./hooks/rekapkehadiran/useRekapProcessor";
import { useExport } from "./hooks/rekapkehadiran/useExport";

export default function RekapKehadiranBulanan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rekap');
  
  // Custom hooks
  const { 
    presensiData, 
    loading, 
    error, 
    loadData,
    refreshData 
  } = usePresensiData();

  const {
    search,
    bulanFilter,
    tahunFilter,
    wilayahFilter,
    setSearch,
    setBulanFilter,
    setTahunFilter,
    setWilayahFilter,
    resetFilters,
    setToCurrentMonth,
    activeFilterCount,
    getBulanOptions,
    getTahunOptions,
    getBulanLabel
  } = useFilters();

  const {
    rekapBulanan,
    statistikBulanan,
    processing,
    processRekap,
    getDaysInMonth
  } = useRekapProcessor(presensiData, bulanFilter, tahunFilter, wilayahFilter, search);

  const {
    exportToExcel,
    handlePrint
  } = useExport();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Process rekap when filters or data change
  useEffect(() => {
    if (presensiData && presensiData.length > 0 && bulanFilter && tahunFilter) {
      processRekap();
    }
  }, [bulanFilter, tahunFilter, wilayahFilter, search, presensiData, processRekap]);

  // Pastikan nilai selalu array/object dengan default
  const safeRekapBulanan = Array.isArray(rekapBulanan) ? rekapBulanan : [];
  const safeStatistikBulanan = statistikBulanan || {
    totalPegawai: 0,
    totalHadir: 0,
    totalTerlambat: 0,
    totalIzin: 0,
    totalTanpaKeterangan: 0,
    persenHadir: 0,
    persenTerlambat: 0,
    persenIzin: 0,
    persenTanpaKeterangan: 0
  };

  if (loading) {
    return <LoadingState message="Memuat data presensi..." />;
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title="Rekap Kehadiran Bulanan"
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold">Error memuat data:</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={refreshData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Coba Lagi
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="Rekap Kehadiran Bulanan"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {/* Filter Section */}
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            bulanFilter={bulanFilter}
            onBulanChange={setBulanFilter}
            tahunFilter={tahunFilter}
            onTahunChange={setTahunFilter}
            wilayahFilter={wilayahFilter}
            onWilayahChange={setWilayahFilter}
            onReset={resetFilters}
            onSetCurrentMonth={setToCurrentMonth}
            activeFilterCount={activeFilterCount}
            bulanOptions={getBulanOptions()}
            tahunOptions={getTahunOptions()}
            wilayahOptions={["Cermee", "Prajekan", "Botolinggo", "Klabang", "Ijen"]}
            showExport={Boolean(bulanFilter && tahunFilter && safeRekapBulanan.length > 0)}
            onExport={() => exportToExcel(
              safeRekapBulanan, 
              safeStatistikBulanan, 
              bulanFilter, 
              tahunFilter, 
              wilayahFilter, 
              getBulanLabel
            )}
            onPrint={() => handlePrint(
              bulanFilter, 
              tahunFilter, 
              wilayahFilter, 
              getBulanLabel
            )}
          />

          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            rekapCount={safeRekapBulanan.length}
          />

          {/* Tab Content */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 md:p-6">
              {activeTab === 'rekap' ? (
                <RekapTab
                  processing={processing}
                  bulanFilter={bulanFilter}
                  tahunFilter={tahunFilter}
                  wilayahFilter={wilayahFilter}
                  search={search}
                  rekapBulanan={safeRekapBulanan}
                  statistikBulanan={safeStatistikBulanan}
                  getBulanLabel={getBulanLabel}
                  onRefresh={refreshData}
                  getDaysInMonth={getDaysInMonth}
                />
              ) : (
                <StatistikTab
                  statistikBulanan={safeStatistikBulanan}
                  bulanFilter={bulanFilter}
                  tahunFilter={tahunFilter}
                  wilayahFilter={wilayahFilter}
                  getBulanLabel={getBulanLabel}
                  getDaysInMonth={getDaysInMonth}
                  onBackToRekap={() => setActiveTab('rekap')}
                  onExport={() => exportToExcel(
                    safeRekapBulanan, 
                    safeStatistikBulanan, 
                    bulanFilter, 
                    tahunFilter, 
                    wilayahFilter, 
                    getBulanLabel
                  )}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}