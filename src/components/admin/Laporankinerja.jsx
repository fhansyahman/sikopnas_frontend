'use client';

import { useState } from 'react';
import { useKinerjaData } from './hooks/rekapkinerja/useKinerjaData';
import { useDownloadHandler } from './hooks/rekapkinerja/useDownloadHandler';
import { useSidebar } from './hooks/rekapkinerja/useSidebar';
import { Sidebar } from './components/rekapkinerja/Sidebar';
import { Header } from './components/rekapkinerja/Header';
import { MobileOverlay } from './components/rekapkinerja/MobileOverlay';
import { StatCards } from './components/rekapkinerja/StatCards';
import { FilterBar } from './components/rekapkinerja/FilterBar';
import { DownloadButtons } from './components/rekapkinerja/DownloadButtons';
import { ViewToggle } from './components/rekapkinerja/ViewToggle';
import { ProgressBar } from './components/rekapkinerja/ProgressBar';
import { RekapWilayahView } from './components/rekapkinerja/RekapWilayahView';
import { DetailPeroranganView } from './components/rekapkinerja/DetailPeroranganView';
import { DetailModal } from './components/rekapkinerja/DetailModal';
import { DownloadModal } from './components/rekapkinerja/DownloadModal';
import { LoadingState } from './components/rekapkinerja/LoadingState';
import { ErrorMessage } from './components/rekapkinerja/ErrorMessage';
import { FileText } from 'lucide-react';
export default function RekapKinerjaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);
  const [selectedDownloadType, setSelectedDownloadType] = useState('rekap');
  const [selectedKinerjaForDownload, setSelectedKinerjaForDownload] = useState(null);
  const [activeView, setActiveView] = useState('rekap');

  const {
    kinerjaList,
    loading,
    error,
    statistik,
    selectedWilayah,
    selectedDate,
    setSelectedWilayah,
    setSelectedDate,
    handleResetFilters,
    loadKinerjaData,
    formatDate,
    formatDateShort,
    groupedByWilayah
  } = useKinerjaData();

  const {
    isGeneratingPDF,
    generatingProgress,
    handleDownloadAllPerorangan,
    handleShowDownloadRekap,
    handleShowDownloadPerorangan
  } = useDownloadHandler(kinerjaList, setShowDownloadModal, setSelectedDownloadType, setSelectedKinerjaForDownload);

  const { handleLogout } = useSidebar();

  const handleViewDetail = (kinerja) => {
    setSelectedDetailData(kinerja);
    setDetailModalOpen(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileOverlay sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {/* System Overview Cards */}
          <StatCards 
            statistik={statistik}
            selectedWilayah={selectedWilayah}
            selectedDate={selectedDate}
            formatDateShort={formatDateShort}
          />

          {/* Filter Bar */}
          <FilterBar
            selectedWilayah={selectedWilayah}
            selectedDate={selectedDate}
            onWilayahChange={setSelectedWilayah}
            onDateChange={setSelectedDate}
            onRefresh={loadKinerjaData}
            onReset={handleResetFilters}
            formatDateShort={formatDateShort}
          />

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <DownloadButtons
              kinerjaList={kinerjaList}
              isGeneratingPDF={isGeneratingPDF}
              onDownloadRekap={handleShowDownloadRekap}
              onDownloadAllPerorangan={handleDownloadAllPerorangan}
            />
            <ViewToggle activeView={activeView} setActiveView={setActiveView} />
          </div>

          {/* Progress Bar */}
          {isGeneratingPDF && (
            <ProgressBar 
              progress={generatingProgress}
              type={selectedDownloadType}
              totalFiles={kinerjaList.length}
            />
          )}

          {/* Error Message */}
          {error && <ErrorMessage error={error} />}

          {/* Content Area */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <div className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">
                {activeView === 'rekap' ? 'Rekap per Wilayah' : 'Detail Perorangan'}
                <span className="ml-2 text-gray-500">
                  ({kinerjaList.length} data)
                </span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-6">
              {activeView === 'rekap' ? (
                <RekapWilayahView
                  groupedByWilayah={groupedByWilayah}
                  selectedWilayah={selectedWilayah}
                  selectedDate={selectedDate}
                  formatDateShort={formatDateShort}
                  onViewDetail={handleViewDetail}
                  onDownloadPerorangan={handleShowDownloadPerorangan}
                />
              ) : (
                <DetailPeroranganView
                  kinerjaList={kinerjaList}
                  formatDateShort={formatDateShort}
                  onViewDetail={handleViewDetail}
                  onDownloadPerorangan={handleShowDownloadPerorangan}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        data={selectedDetailData}
        formatDate={formatDate}
        onDownload={() => {
          setDetailModalOpen(false);
          handleShowDownloadPerorangan(selectedDetailData);
        }}
      />

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        type={selectedDownloadType}
        data={selectedDownloadType === 'rekap' ? kinerjaList : selectedKinerjaForDownload}
        wilayah={selectedWilayah}
        tanggal={selectedDate}
        formatDateShort={formatDateShort}
      />
    </div>
  );
}