"use client";

import { Sidebar } from "./components/jamkerja/Sidebar";
import { Header } from "./components/jamkerja/Header";
import { LoadingState } from "./components/jamkerja/LoadingState";
import { StatsCards } from "./components/jamkerja/StatsCards";
import { ActionBar } from "./components/jamkerja/ActionBar";
import { JamKerjaTable } from "./components/jamkerja/JamKerjaTable";
import { FormModal } from "./components/jamkerja/FormModal";
import { DetailModal } from "./components/jamkerja/DetailModal";
import { useJamKerja } from "./hooks/jamkerja/useJamKerja";

export default function JamKerjaManagement() {
  const {
    // Data & States
    jamKerja,
    loading,
    error,
    search,
    statusFilter,
    currentPage,
    itemsPerPage,
    showModal,
    showDetailModal,
    editingJamKerja,
    selectedJamKerja,
    sidebarOpen,
    
    // Data hasil filter & pagination
    filteredJamKerja,
    paginatedJamKerja,
    totalPages,
    startIndex,
    stats,
    
    // Actions
    setSearch,
    setStatusFilter,
    setCurrentPage,
    setSidebarOpen,
    handleShowAddModal,
    handleShowEditModal,
    handleViewDetail,
    handleDelete,
    handleSubmit,
    handleCloseModal,
    handleCloseDetailModal,
    loadJamKerja,
    handleLogout,
    
    // Utilities
    formatTime,
    calculateTotalHours
  } = useJamKerja();

  if (loading && jamKerja.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
          title="Manajemen Jam Kerja"
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Stats Cards */}
          <StatsCards stats={stats} jamKerja={jamKerja} />

          {/* Action Bar */}
          <ActionBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onAdd={handleShowAddModal}
            onRefresh={loadJamKerja}
          />

          {/* Table */}
          <JamKerjaTable
            paginatedJamKerja={paginatedJamKerja}
            filteredJamKerja={filteredJamKerja}
            onViewDetail={handleViewDetail}
            onEdit={handleShowEditModal}
            onDelete={handleDelete}
            formatTime={formatTime}
            calculateTotalHours={calculateTotalHours}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                startIndex={startIndex}
                endIndex={Math.min(startIndex + itemsPerPage, filteredJamKerja.length)}
                totalItems={filteredJamKerja.length}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <FormModal
        showModal={showModal}
        onClose={handleCloseModal}
        editingJamKerja={editingJamKerja}
        onSubmit={handleSubmit}
      />

      <DetailModal
        showModal={showDetailModal}
        onClose={handleCloseDetailModal}
        selectedJamKerja={selectedJamKerja}
        onEdit={handleShowEditModal}
        formatTime={formatTime}
        calculateTotalHours={calculateTotalHours}
      />
    </div>
  );
}