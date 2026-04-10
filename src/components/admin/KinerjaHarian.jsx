"use client";

import { useState } from "react";
import { Sidebar } from "./components/kinerjaharian/Sidebar";
import { Header } from "./components/kinerjaharian/Header";
import { LoadingState } from "./components/kinerjaharian/LoadingState";
import { StatsCards } from "./components/kinerjaharian/StatsCards";
import { DataKinerjaTab } from "./components/kinerjaharian/DataKinerjaTab";
import { StatistikTab } from "./components/kinerjaharian/StatistikTab";
import { SearchBar } from "./components/kinerjaharian/SearchBar";
import { FilterBar } from "./components/kinerjaharian/FilterBar";
import { ActiveFilters } from "./components/kinerjaharian/ActiveFilters";
import { BulkActionBar } from "./components/kinerjaharian/BulkActionBar";
import { DetailModal } from "./components/kinerjaharian/DetailModal";
import { EditModal } from "./components/kinerjaharian/EditModal";
import { DownloadModal } from "./components/kinerjaharian/DownloadModal";
import { ImageViewerModal } from "./components/kinerjaharian/ImageViewerModal";
import { useKinerjaData } from "./hooks/kinerjaharian/useKinerjaData";
import { useFilters } from "./hooks/kinerjaharian/useFilters";
import { useModals } from "./hooks/kinerjaharian/useModals";
import { Database, TrendingUp } from "lucide-react";

// Fungsi helper untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export default function AdminKinerjaHarian() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  
  // Filters state
  const [search, setSearch] = useState("");
  
  // Custom hooks
  const {
    kinerjaList,
    filteredKinerja,
    loading,
    error,
    statistik,
    selectedItems,
    setSelectedItems,
    loadKinerjaData,
    handleDelete,
    handleBulkDelete,
    isProcessing,
    selectedDate,
    setSelectedDate,
    selectedWilayah,
    setSelectedWilayah,
    tanggalInfo
  } = useKinerjaData(search);

  const {
    wilayahFilter,
    setWilayahFilter,
    selectedDate: filterDate,
    setSelectedDate: setFilterDate,
    handleResetFilters,
    hasActiveFilters,
    goToPreviousDay,
    goToNextDay,
    goToToday
  } = useFilters(loadKinerjaData);

  const {
    showDetailModal,
    showEditModal,
    showDownloadModal,
    showImageViewer,
    selectedKinerja,
    selectedImage,
    currentImageIndex,
    formData,
    setFormData,
    openDetailModal,
    openEditModal,
    openDownloadModal,
    openImageViewer,
    closeDetailModal,
    closeEditModal,
    closeDownloadModal,
    closeImageViewer,
    navigateImage,
    downloadImage,
    getImageList
  } = useModals();

  // Sync selectedDate from filter to hook
  const handleDateChange = (newDate) => {
    setFilterDate(newDate);
    setSelectedDate(newDate);
  };

  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implementasi edit
      closeEditModal();
      loadKinerjaData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle reset all filters
  const handleResetAllFilters = () => {
    setSearch("");
    handleResetFilters();
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  if (loading && kinerjaList.length === 0) {
    return <LoadingState />;
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
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {/* Stats Cards */}
          <StatsCards 
            statistik={statistik}
            selectedDate={selectedDate}
            tanggalInfo={tanggalInfo}
          />

          {/* Action Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <SearchBar 
                search={search}
                setSearch={setSearch}
              />
              
              <FilterBar
                wilayahFilter={wilayahFilter}
                setWilayahFilter={setWilayahFilter}
                selectedDate={filterDate}
                setSelectedDate={handleDateChange}
                onRefresh={loadKinerjaData}
                onReset={handleResetAllFilters}
                hasActiveFilters={hasActiveFilters || search}
                onPreviousDay={goToPreviousDay}
                onNextDay={goToNextDay}
                onToday={goToToday}
              />

              <ActiveFilters
                wilayahFilter={wilayahFilter}
                setWilayahFilter={setWilayahFilter}
                search={search}
                setSearch={setSearch}
              />

              <BulkActionBar
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                onBulkDelete={handleBulkDelete}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <TabButton
                active={activeTab === 'data'}
                onClick={() => setActiveTab('data')}
                icon={<Database size={16} />}
                label={`Data Kinerja (${filteredKinerja.length})`}
              />
              <TabButton
                active={activeTab === 'statistik'}
                onClick={() => setActiveTab('statistik')}
                icon={<TrendingUp size={16} />}
                label="Statistik"
              />
            </div>

            <div className="p-4 md:p-6">
              {activeTab === 'data' ? (
                <DataKinerjaTab
                  kinerjaList={filteredKinerja}
                  filteredKinerja={filteredKinerja}
                  loading={loading}
                  error={error}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  selectedDate={selectedDate}
                  statistik={statistik}
                  onRefresh={loadKinerjaData}
                  onViewDetail={openDetailModal}
                  onDownload={openDownloadModal}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onToggleSelect={(id) => {
                    setSelectedItems(prev =>
                      prev.includes(id)
                        ? prev.filter(item => item !== id)
                        : [...prev, id]
                    );
                  }}
                  onSelectAll={() => {
                    if (selectedItems.length === filteredKinerja.length) {
                      setSelectedItems([]);
                    } else {
                      setSelectedItems(filteredKinerja.map(item => item.id));
                    }
                  }}
                />
              ) : (
                <StatistikTab
                  statistik={statistik}
                  kinerjaList={filteredKinerja}
                  selectedDate={selectedDate}
                  onResetFilters={handleResetAllFilters}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <DetailModal
        isOpen={showDetailModal}
        onClose={closeDetailModal}
        kinerja={selectedKinerja}
        onDownload={openDownloadModal}
        onEdit={openEditModal}
        onOpenImage={openImageViewer}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
        getImageList={getImageList}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        kinerja={selectedKinerja}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSubmit}
        onSuccess={() => {
          closeEditModal();
          loadKinerjaData();
        }}
      />

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={closeDownloadModal}
        kinerja={selectedKinerja}
      />

      <ImageViewerModal
        isOpen={showImageViewer}
        onClose={closeImageViewer}
        selectedImage={selectedImage}
        currentImageIndex={currentImageIndex}
        onNavigate={navigateImage}
        onDownload={downloadImage}
        imageList={getImageList(selectedKinerja)}
        kinerja={selectedKinerja}
      />
    </div>
  );
}

// Helper Components
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
        active 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
    </button>
  );
}