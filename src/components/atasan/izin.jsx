"use client";

import { useState, useEffect } from "react"; // Tambahkan useEffect
import { Sidebar } from "./components/izin/Sidebar";
import { Header } from "./components/izin/Header";
import { MobileOverlay } from "./components/izin/MobileOverlay";
import { StatsCards } from "./components/izin/StatsCards";
import { ActionBar } from "./components/izin/ActionBar";
import { BulkActionBar } from "./components/izin/BulkActionBar";
import { FilterTags } from "./components/izin/FilterTags";
import { TabNavigation } from "./components/izin/TabNavigation";
import { DataTab } from "./components/izin/DataTab";
import { StatistikTab } from "./components/izin/StatistikTab";
import { DetailModal } from "./components/izin/DetailModal";
import { ConfirmModal } from "./components/izin/ConfirmModal";
import { BulkConfirmModal } from "./components/izin/BulkConfirmModal";
import { CreateIzinModal } from "./components/izin/CreateIzinModal";
import { LoadingSpinner } from "./components/izin/LoadingSpinner";
import { useIzinData } from "./hooks/izin/useIzinData";
import { useFilters } from "./hooks/izin/useFilters";
import { useSelection } from "./hooks/izin/useSelection";
import { useModal } from "./hooks/izin/useModal";
import { useAuth } from "@/context/AuthContext";
import { izinAPI } from "@/lib/api";
import Swal from "sweetalert2";

export default function IzinManagement() {
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Custom hooks
  const {
    izinList,
    statistik,
    loading,
    error,
    filteredIzin,
    isProcessing,
    search,
    setSearch,
    loadIzinData,
    handleUpdateStatus,
    handleBulkAction
  } = useIzinData();

  const {
    statusFilter,
    jenisFilter,
    tanggalFilter,
    wilayahFilter,
    setStatusFilter,
    setJenisFilter,
    setTanggalFilter,
    setWilayahFilter,
    handleResetFilters,
    handleRefresh,
    activeFilterCount,
    user: filterUser
  } = useFilters(loadIzinData);

  const {
    selectedItems,
    setSelectedItems,
    toggleSelectItem,
    toggleSelectAll,
    clearSelection
  } = useSelection(filteredIzin);

  const {
    modalState,
    openDetailModal,
    closeDetailModal,
    openConfirmModal,
    closeConfirmModal,
    openBulkModal,
    closeBulkModal
  } = useModal();

  const isAdmin = user?.roles === 'admin' || user?.roles === 'superadmin';
  const isAtasan = user?.roles === 'atasan';

  // Debug: Log user dan filter
  useEffect(() => {
    if (user) {
      console.log('Current user:', {
        nama: user.nama,
        roles: user.roles,
        wilayah_penugasan: user.wilayah_penugasan
      });
    }
  }, [user]);

  // Debug: Log filter yang aktif
  useEffect(() => {
    console.log('Active filters:', {
      wilayah: wilayahFilter,
      status: statusFilter,
      jenis: jenisFilter,
      tanggal: tanggalFilter
    });
  }, [wilayahFilter, statusFilter, jenisFilter, tanggalFilter]);

  // Tampilkan loading jika auth masih loading
  if (authLoading) {
    return <LoadingSpinner fullScreen message="Memuat data user..." />;
  }

  // Tampilkan error jika tidak ada user
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Silakan login terlebih dahulu</p>
        </div>
      </div>
    );
  }

  const handleCreateIzin = async (formData) => {
    try {
      const start = new Date(formData.tanggal_mulai);
      const end = new Date(formData.tanggal_selesai);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const response = await izinAPI.createByAdmin(formData);
      
      if (response.data?.success) {
        const presensiGenerated = response.data.data?.presensi_generated || 0;
        
        Swal.fire({
          icon: 'success',
          title: 'Izin Berhasil Dibuat!',
          html: `
            <div class="text-left">
              <p class="mb-2">✅ Izin berhasil dibuat dan disetujui</p>
              <p class="mb-1">📅 Durasi: ${diffDays} hari</p>
              ${presensiGenerated > 0 ? 
                `<p class="text-green-600">✓ ${presensiGenerated} data presensi otomatis digenerate</p>` : 
                '<p class="text-yellow-600">⚠️ Presensi tidak digenerate otomatis</p>'
              }
            </div>
          `,
          confirmButtonColor: '#10B981',
          timer: 3000
        });
        
        loadIzinData();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating izin:', error);
      
      const errorMsg = error.response?.data?.message || 'Gagal membuat izin';
      
      if (errorMsg.includes('sudah memiliki izin')) {
        Swal.fire({
          icon: 'warning',
          title: 'Duplikasi Izin',
          text: 'Pegawai sudah memiliki izin yang disetujui pada tanggal tersebut',
          confirmButtonColor: '#F59E0B'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMsg,
          confirmButtonColor: '#EF4444'
        });
      }
      throw error;
    }
  };

  if (loading && izinList.length === 0) {
    return <LoadingSpinner fullScreen message="Memuat data izin..." />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Mobile Overlay */}
      <MobileOverlay 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title="Manajemen Izin & Cuti"
          user={user}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-6">
            {/* Info Wilayah untuk Atasan */}
            {isAtasan && user?.wilayah_penugasan && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user.wilayah_penugasan.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">
                      Anda login sebagai <span className="font-semibold">Atasan</span> dengan wilayah penugasan
                    </p>
                    <p className="text-lg font-semibold text-blue-800">
                      {user.wilayah_penugasan}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <StatsCards 
              statistik={statistik}
              tanggalFilter={tanggalFilter}
            />

            {/* Action Bar */}
            <ActionBar
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              jenisFilter={jenisFilter}
              onJenisFilterChange={setJenisFilter}
              tanggalFilter={tanggalFilter}
              onTanggalFilterChange={setTanggalFilter}
              wilayahFilter={wilayahFilter}
              onWilayahFilterChange={setWilayahFilter}
              onRefresh={handleRefresh}
              onReset={handleResetFilters}
              showResetButton={activeFilterCount > 0}
              onCreateClick={() => setShowCreateModal(true)}
            />

            {/* Filter Tags */}
            <FilterTags
              statusFilter={statusFilter}
              jenisFilter={jenisFilter}
              tanggalFilter={tanggalFilter}
              wilayahFilter={wilayahFilter}
              onClearStatus={() => setStatusFilter('')}
              onClearJenis={() => setJenisFilter('')}
              onClearTanggal={() => {
                const today = new Date().toISOString().split('T')[0];
                setTanggalFilter(today);
              }}
              onClearWilayah={() => {
                if (user?.wilayah_penugasan) {
                  setWilayahFilter(user.wilayah_penugasan);
                } else {
                  setWilayahFilter('');
                }
              }}
              user={user}
            />

            {/* Bulk Action Bar - Hanya untuk admin */}
            {isAdmin && selectedItems.length > 0 && (
              <BulkActionBar
                selectedCount={selectedItems.length}
                onBulkAction={(action) => openBulkModal(action, selectedItems)}
                onClearSelection={clearSelection}
                isProcessing={isProcessing}
              />
            )}

            {/* Tab Navigation & Content */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-6">
              <TabNavigation 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                totalData={izinList.length}
              />

              <div className="p-6">
                {activeTab === 'data' && (
                  <DataTab
                    izinList={izinList}
                    filteredIzin={filteredIzin}
                    statistik={statistik}
                    tanggalFilter={tanggalFilter}
                    error={error}
                    selectedItems={selectedItems}
                    onToggleSelect={toggleSelectItem}
                    onToggleSelectAll={toggleSelectAll}
                    onViewDetail={openDetailModal}
                    onUpdateStatus={(id, status) => 
                      openConfirmModal('update', { id, status })
                    }
                    onRefresh={handleRefresh}
                    onSetToday={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setTanggalFilter(today);
                    }}
                    isAdmin={isAdmin}
                  />
                )}

                {activeTab === 'statistik' && (
                  <StatistikTab
                    statistik={statistik}
                    izinList={izinList}
                    tanggalFilter={tanggalFilter}
                    onResetToToday={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setTanggalFilter(today);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <DetailModal
        isOpen={modalState.isOpen && modalState.type === 'detail'}
        onClose={closeDetailModal}
        izin={modalState.data}
        onUpdateStatus={(id, status) => {
          closeDetailModal();
          openConfirmModal('update', { id, status });
        }}
        isAdmin={isAdmin}
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'confirm'}
        onClose={closeConfirmModal}
        onConfirm={() => {
          if (modalState.data) {
            handleUpdateStatus(modalState.data.id, modalState.data.status);
          }
          closeConfirmModal();
        }}
        title={modalState.data?.status === 'Disetujui' ? 'Setujui Izin' : 'Tolak Izin'}
        message={`Yakin ingin ${modalState.data?.status === 'Disetujui' ? 'menyetujui' : 'menolak'} pengajuan izin ini?`}
        confirmText={modalState.data?.status === 'Disetujui' ? 'Ya, Setujui' : 'Ya, Tolak'}
        confirmColor={modalState.data?.status === 'Disetujui' ? 'green' : 'red'}
      />

      <BulkConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'bulk'}
        onClose={closeBulkModal}
        onConfirm={async () => {
          await handleBulkAction(modalState.data?.action, modalState.data?.items);
          closeBulkModal();
          clearSelection();
        }}
        action={modalState.data?.action}
        count={modalState.data?.items?.length || 0}
        isProcessing={isProcessing}
      />

      {/* Create Modal - Hanya untuk admin */}
      {isAdmin && (
        <CreateIzinModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateIzin}
        />
      )}
    </div>
  );
}