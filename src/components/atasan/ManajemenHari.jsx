"use client";

import { useState } from "react";
import { Sidebar } from "./components/harikerja/Sidebar";
import { Header } from "./components/harikerja/Header";
import { StatsCards } from "./components/harikerja/StatsCards";
import { TabNavigation } from "./components/harikerja/TabNavigation";
import { KalenderTab } from "./components/harikerja/KalenderTab";
import { HariKerjaTab } from "./components/harikerja/HariKerjaTab";
import { HariLiburTab } from "./components/harikerja/HariLiburTab";
import { HariKerjaModal } from "./components/harikerja/HariKerjaModal";
import { HariLiburModal } from "./components/harikerja/HariLiburModal";
import { BulkUpdateModal } from "./components/harikerja/BulkUpdateModal";
import { LoadingSpinner } from "./components/harikerja/LoadingSpinner";
import { useHariData } from "./hooks/harikerja/useHariData";

export default function ManajemenHariPage() {
  const {
    // States
    activeTab,
    setActiveTab,
    tahunFilter,
    setTahunFilter,
    bulanFilter,
    setBulanFilter,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    sidebarOpen,
    setSidebarOpen,
    loading,
    error,
    kalender,
    hariKerjaList,
    hariLiburList,
    filteredHariKerja,
    filteredHariLibur,
    totalPages,
    getCurrentData,
    
    // Modal states
    showHariKerjaModal,
    setShowHariKerjaModal,
    showHariLiburModal,
    setShowHariLiburModal,
    showBulkModal,
    setShowBulkModal,
    isEdit,
    selectedHari,
    
    // Form states
    hariKerjaForm,
    setHariKerjaForm,
    hariLiburForm,
    setHariLiburForm,
    bulkForm,
    setBulkForm,
    
    // Handlers
    handleEditHariKerja,
    handleEditHariLibur,
    handleDeleteHariKerja,
    handleDeleteHariLibur,
    handleSubmitHariKerja,
    handleSubmitHariLibur,
    handleBulkSubmit,
    resetHariKerjaForm,
    resetHariLiburForm,
    resetBulkForm,
    refreshData,
    getHariStatus,
    formatDate,
    
    // Options
    tahunOptions,
  } = useHariData();

  if (loading && kalender.length === 0) {
    return <LoadingSpinner />;
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
          title="Manajemen Hari Kerja & Libur"
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <StatsCards 
            totalHariKerja={hariKerjaList.filter(h => h.is_hari_kerja === 1).length}
            totalHariLibur={hariLiburList.length}
            totalHariBulan={kalender.length}
            tahunFilter={tahunFilter}
          />

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            />

            {/* Tab Content */}
            {activeTab === 'kalender' && (
              <KalenderTab
                kalender={kalender}
                tahunFilter={tahunFilter}
                bulanFilter={bulanFilter}
                onTahunChange={setTahunFilter}
                onBulanChange={setBulanFilter}
                onRefresh={refreshData}
                getHariStatus={getHariStatus}
                tahunOptions={tahunOptions}
              />
            )}

            {activeTab === 'hari-kerja' && (
              <HariKerjaTab
                data={getCurrentData()}
                filteredData={filteredHariKerja}
                search={search}
                onSearchChange={setSearch}
                tahunFilter={tahunFilter}
                bulanFilter={bulanFilter}
                onTahunChange={setTahunFilter}
                onBulanChange={setBulanFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={10}
                onRefresh={refreshData}
                onAdd={() => {
                  resetHariKerjaForm();
                  setShowHariKerjaModal(true);
                }}
                onBulkUpdate={() => setShowBulkModal(true)}
                onEdit={handleEditHariKerja}
                onDelete={handleDeleteHariKerja}
                tahunOptions={tahunOptions}
                formatDate={formatDate}
              />
            )}

            {activeTab === 'hari-libur' && (
              <HariLiburTab
                data={getCurrentData()}
                filteredData={filteredHariLibur}
                search={search}
                onSearchChange={setSearch}
                tahunFilter={tahunFilter}
                onTahunChange={setTahunFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={10}
                onRefresh={refreshData}
                onAdd={() => {
                  resetHariLiburForm();
                  setShowHariLiburModal(true);
                }}
                onEdit={handleEditHariLibur}
                onDelete={handleDeleteHariLibur}
                tahunOptions={tahunOptions}
                formatDate={formatDate}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <HariKerjaModal
        isOpen={showHariKerjaModal}
        onClose={() => {
          setShowHariKerjaModal(false);
          resetHariKerjaForm();
        }}
        onSubmit={handleSubmitHariKerja}
        formData={hariKerjaForm}
        setFormData={setHariKerjaForm}
        isEdit={isEdit}
      />

      <HariLiburModal
        isOpen={showHariLiburModal}
        onClose={() => {
          setShowHariLiburModal(false);
          resetHariLiburForm();
        }}
        onSubmit={handleSubmitHariLibur}
        formData={hariLiburForm}
        setFormData={setHariLiburForm}
        isEdit={isEdit}
        tahunOptions={tahunOptions}
      />

      <BulkUpdateModal
        isOpen={showBulkModal}
        onClose={() => {
          setShowBulkModal(false);
          resetBulkForm();
        }}
        onSubmit={handleBulkSubmit}
        formData={bulkForm}
        setFormData={setBulkForm}
      />
    </div>
  );
}