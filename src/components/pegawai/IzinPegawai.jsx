"use client";

import { useState } from "react";
import { Header } from "./components/izin/Header";
import { TabNavigation } from "./components/izin/TabNavigation";
import { PengajuanForm } from "./components/izin/PengajuanForm";
import { DataIzinList } from "./components/izin/DataIzinList";
import { LoadingState } from "./components/izin/LoadingState";
import { useIzinData } from "./hooks/izin/useIzinData";

export default function IzinPage() {
  const [tab, setTab] = useState("persetujuan");
  const [currentEditId, setCurrentEditId] = useState(null);
  
  const {
    loading,
    userInfo,
    izinList,
    filteredIzinList,
    selectedMonth,
    selectedYear,
    showFilter,
    isFilterActive,
    setSelectedMonth,
    setSelectedYear,
    setShowFilter,
    resetFilter,
    loadIzin,
    getAvailableMonths,
    getAvailableYears,
    getMonthName
  } = useIzinData();

  const handleEdit = (izin) => {
    setCurrentEditId(izin);
    setTab("pengajuan");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setCurrentEditId(null);
    loadIzin(); // Refresh data izin
    setTab("persetujuan"); // Pindah ke tab Data Izin setelah sukses
  };

  const handleCancel = () => {
    setCurrentEditId(null);
    setTab("persetujuan"); // Pindah ke tab Data Izin saat batal
  };

  if (loading && izinList.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userInfo={userInfo} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TabNavigation tab={tab} onTabChange={setTab} />

        {tab === "pengajuan" && (
          <PengajuanForm
            key={currentEditId?.id || 'new'}
            editData={currentEditId}
            onSuccess={handleSuccess}
            onCancel={handleCancel} // Gunakan handleCancel yang sudah dimodifikasi
          />
        )}

        {tab === "persetujuan" && (
          <DataIzinList
            data={filteredIzinList}
            totalData={izinList.length}
            userInfo={userInfo}
            loading={loading}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            showFilter={showFilter}
            isFilterActive={isFilterActive}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onToggleFilter={() => setShowFilter(!showFilter)}
            onResetFilter={resetFilter}
            onNewRequest={() => {
              setCurrentEditId(null);
              setTab("pengajuan");
            }}
            onEdit={handleEdit}
            onRefresh={loadIzin}
            getAvailableMonths={getAvailableMonths}
            getAvailableYears={getAvailableYears}
            getMonthName={getMonthName}
          />
        )}
      </div>
    </div>
  );
}