// app/pegawai/kinerja/page.jsx (or wherever your main page is)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./components/kinerja/Header";
import { StatsCard } from "./components/kinerja/StatsCard";
import { TabNavigation } from "./components/kinerja/TabNavigation";
import { KinerjaForm } from "./components/kinerja/KinerjaForm";
import { KinerjaList } from "./components/kinerja/KinerjaList";
import { ImageModal } from "./components/kinerja/ImageModal";
import { LoadingState } from "./components/kinerja/LoadingState";
import { useKinerjaData } from "./hooks/kinerja/useKinerjaData";
import { useLocation } from "./hooks/useLocation"; // Import location hook

export default function KinerjaPage() {
  const router = useRouter();
  const [tab, setTab] = useState("input");
  const [editId, setEditId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Get location for camera capture
  const { coords, alamat, status, ambilLokasi, isLoading: locationLoading } = useLocation();

  const {
    loading,
    kinerjaList,
    filteredKinerja,
    stats,
    efficiency,
    selectedMonth,
    selectedYear,
    searchTerm,
    availableYears,
    error,
    setSelectedMonth,
    setSelectedYear,
    setSearchTerm,
    loadKinerja,
    handleEdit: loadEditData,
    handleDelete,
    formatDate
  } = useKinerjaData();

  // Get location when camera is about to be used
  const handleOpenCamera = async () => {
    await ambilLokasi();
  };

  const handleEdit = (id) => {
    const item = loadEditData(id);
    if (item) {
      setEditId(item);
      setTab("input");
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleSuccess = () => {
    setEditId(null);
    loadKinerja();
    setTab("tampilan");
  };

  const handleCancel = () => {
    setEditId(null);
    setTab("tampilan");
  };

  // Prepare location data for camera
  const locationData = {
    coords: coords,
    alamat: alamat,
    status: status
  };

  if (loading && kinerjaList.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onBack={() => router.push('/pegawai/dashboard')} />

      {/* Error Display */}
      {error && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-red-700">
                <strong>Error:</strong> {error}
              </div>
              <button
                onClick={() => loadKinerja()}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-6 mt-4 mb-6">
        <StatsCard 
          stats={stats}
          efficiency={efficiency}
          totalLaporan={kinerjaList.length}
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto text-black px-6 pb-6">
        <TabNavigation tab={tab} onTabChange={setTab} />

        {tab === "input" && (
          <KinerjaForm
            key={editId?.id || 'new'}
            editData={editId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            locationData={locationData}
          />
        )}

        {tab === "tampilan" && (
          <KinerjaList
            data={filteredKinerja}
            totalData={kinerjaList.length}
            loading={loading}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            searchTerm={searchTerm}
            availableYears={availableYears}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onSearchChange={setSearchTerm}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={loadKinerja}
            onNewRequest={() => {
              setEditId(null);
              setTab("input");
            }}
            onImageClick={openImageModal}
            formatDate={formatDate}
          />
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        imageUrl={selectedImage}
        onClose={closeImageModal}
      />
    </div>
  );
}