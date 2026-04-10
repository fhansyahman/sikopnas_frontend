"use client";

import { Layout } from "./components/presensi/Layout";
import { StatsCards } from "./components/presensi/StatsCards";
import { FilterBar } from "./components/presensi/FilterBar";
import { PresensiTable } from "./components/presensi/PresensiTable";
import { StatistikTab } from "./components/presensi/StatistikTab";
import { DetailModal } from "./components/presensi/DetailModal";
import { EditModal } from "./components/presensi/EditModal";
import { FotoModal } from "./components/presensi/FotoModal";
import { ConfirmDialog } from "./components/presensi/ConfirmDialog";
import { LoadingSpinner } from "./components/presensi/LoadingSpinner";
import { ErrorAlert } from "./components/presensi/ErrorAlert";
import { usePresensiData } from "./hooks/presensi/usePresensiData";
import { useFilters } from "./hooks/presensi/useFilters";
import { useModal } from "./hooks/presensi/useModal";
import { useState, useEffect } from "react";

export default function AdminPresensiManagement() {
  const [activeTab, setActiveTab] = useState('data');
  
  const {
    filters,
    setFilters,
    resetFilters,
    activeFilterCount
  } = useFilters();

  const {
    presensiList,
    statistik,
    loading,
    error,
    filteredPresensi,
    loadPresensiData,
    handleGenerateHariIni,
    handleUpdate,
    handleDelete
  } = usePresensiData(filters);

  const {
    modalState,
    openDetailModal,
    closeDetailModal,
    openEditModal,
    closeEditModal,
    openFotoModal,
    closeFotoModal,
    openConfirmDialog,
    closeConfirmDialog,
    selectedPresensi,
    selectedFoto,
    confirmData
  } = useModal();

  // Log ketika filter berubah
  useEffect(() => {
    console.log('🔍 Filter aktif:', filters);
  }, [filters]);

  if (loading && presensiList.length === 0) {
    return <LoadingSpinner fullScreen message="Memuat data presensi..." />;
  }

  return (
    <Layout>
      {/* Header Stats */}
      <StatsCards statistik={statistik} tanggalFilter={filters.tanggal} />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        onRefresh={loadPresensiData}
        onGenerate={handleGenerateHariIni}
        activeFilterCount={activeFilterCount}
        activeTab={activeTab}
      />

      {/* Error Alert */}
      {error && <ErrorAlert error={error} onRetry={loadPresensiData} />}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* ✅ FIX: Kirim presensiList ke TabNavigation */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          totalData={presensiList?.length || 0}
        />

        <div className="p-6">
          {/* Data Presensi Tab */}
          {activeTab === 'data' && (
            <PresensiTable
              data={filteredPresensi}
              totalData={presensiList.length}
              statistik={statistik}
              tanggalFilter={filters.tanggal}
              onViewDetail={openDetailModal}
              onEdit={openEditModal}
              onDelete={(id) => openConfirmDialog({
                id,
                title: 'Hapus Data Presensi',
                message: 'Data yang dihapus tidak dapat dikembalikan',
                onConfirm: handleDelete
              })}
              loading={loading}
            />
          )}

          {/* Statistik Tab */}
          {activeTab === 'statistik' && (
            <StatistikTab
              statistik={statistik}
              presensiList={presensiList}
              tanggalFilter={filters.tanggal}
              onResetDate={() => setFilters({ 
                ...filters, 
                tanggal: new Date().toISOString().split('T')[0] 
              })}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <DetailModal
        isOpen={modalState.detail}
        onClose={closeDetailModal}
        presensi={selectedPresensi}
        onEdit={openEditModal}
        onShowFoto={openFotoModal}
        formatDate={formatDate}
        formatTime={formatTime}
        getStatusPresensi={getStatusPresensi}
      />

      <EditModal
        isOpen={modalState.edit}
        onClose={closeEditModal}
        presensi={selectedPresensi}
        onSubmit={handleUpdate}
        onRefresh={loadPresensiData}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      <FotoModal
        isOpen={modalState.foto}
        onClose={closeFotoModal}
        foto={selectedFoto}
        presensi={selectedPresensi}
        formatTime={formatTime}
      />

      <ConfirmDialog
        isOpen={modalState.confirm}
        onClose={closeConfirmDialog}
        onConfirm={() => {
          if (confirmData?.onConfirm && confirmData?.id) {
            confirmData.onConfirm(confirmData.id);
          }
          closeConfirmDialog();
        }}
        title={confirmData?.title}
        message={confirmData?.message}
      />
    </Layout>
  );
}

// ✅ FIX: TabNavigation dengan parameter totalData
function TabNavigation({ activeTab, onTabChange, totalData }) {
  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => onTabChange('data')}
        className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
          activeTab === 'data' 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>📊</span>
          Data Presensi {totalData > 0 && `(${totalData})`}
        </div>
      </button>
      
      <button
        onClick={() => onTabChange('statistik')}
        className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
          activeTab === 'statistik' 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>📈</span>
          Statistik
        </div>
      </button>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  if (!timeString) return '-';
  return timeString.split(':').slice(0, 2).join(':');
}

function getStatusPresensi(presensi) {
  if (!presensi) return 'Tidak Diketahui';
  if (presensi.izin_id) return 'Izin';
  if (presensi.jam_masuk === null) return 'Tanpa Keterangan';
  return presensi.status_masuk || 'Tanpa Keterangan';
}