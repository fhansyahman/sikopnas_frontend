"use client";

import { useState } from "react";
import { MainLayout } from "\./components/aktifuser//MainLayout";
import { StatCards } from "\./components/aktifuser/StatCards";
import { FilterBar } from "\./components/aktifuser/FilterBar";
import { DataTable } from "\./components/aktifuser/DataTable";
import { StatistikTab } from "\./components/aktifuser/StatistikTab";
import { DetailModal } from "\./components/aktifuser/DetailModal";
import { LoadingSpinner } from "\./components/aktifuser/LoadingSpinner";
import { ErrorAlert } from "\./components/aktifuser/ErrorAlert";
import { useUserData } from "./hooks/aktifuser/useUserData";
import { useFilter } from "./hooks/aktifuser/useFilter";
import { usePagination } from "./hooks/aktifuser/usePagination";
import { useSelection } from "./hooks/aktifuser/useSelection";
import { Database, TrendingUp } from "lucide-react";
export default function ManajemenStatusPegawai() {
  const [activeTab, setActiveTab] = useState('data');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Custom hooks
  const {
    usersList,
    sortedUsers,
    statistik,
    loading,
    error,
    loadUsersData,
    handleActivate,
    handleDeactivate,
    formatDate,
    formatDateTime,
    getStatusBadge,
    getAktivasiBadge
  } = useUserData();

  const {
    search,
    setSearch,
    aktivasiFilter,
    setAktivasiFilter,
    filteredUsers,
    handleResetFilters
  } = useFilter(sortedUsers);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    paginate,
    nextPage,
    prevPage,
    indexOfFirstItem,
    indexOfLastItem
  } = usePagination(filteredUsers, 10);

  const {
    selectedItems,
    toggleSelectItem,
    toggleSelectAll,
    isAllSelected
  } = useSelection(currentItems);

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleActivateWithModal = async (user) => {
    setShowDetailModal(false);
    await handleActivate(user);
  };

  const handleDeactivateWithModal = async (user) => {
    setShowDetailModal(false);
    await handleDeactivate(user);
  };

  if (loading && usersList.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
      {/* System Overview Cards */}
      <StatCards statistik={statistik} />

      {/* Action Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        aktivasiFilter={aktivasiFilter}
        onAktivasiFilterChange={setAktivasiFilter}
        onRefresh={loadUsersData}
        onResetFilters={handleResetFilters}
        hasActiveFilters={!!(aktivasiFilter || search)}
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          <TabButton
            active={activeTab === 'data'}
            onClick={() => setActiveTab('data')}
            icon={<Database size={16} />}
            label={`Data Pegawai (${usersList.length})`}
          />
          <TabButton
            active={activeTab === 'statistik'}
            onClick={() => setActiveTab('statistik')}
            icon={<TrendingUp size={16} />}
            label="Statistik"
          />
        </div>

        <div className="p-6">
          {error && <ErrorAlert error={error} onRetry={loadUsersData} />}

          {activeTab === 'data' ? (
            <DataTable
              currentItems={currentItems}
              filteredUsers={filteredUsers}
              statistik={statistik}
              selectedItems={selectedItems}
              isAllSelected={isAllSelected}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelectItem={toggleSelectItem}
              onViewDetail={handleViewDetail}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              getStatusBadge={getStatusBadge}
              getAktivasiBadge={getAktivasiBadge}
              formatDate={formatDate}
              pagination={{
                currentPage,
                totalPages,
                indexOfFirstItem,
                indexOfLastItem,
                totalItems: filteredUsers.length,
                onPageChange: paginate,
                onNext: nextPage,
                onPrev: prevPage
              }}
            />
          ) : (
            <StatistikTab 
              statistik={statistik} 
              usersList={usersList}
            />
          )}
        </div>
      </div>

      {/* Modal Detail Pegawai */}
      {showDetailModal && selectedUser && (
        <DetailModal
          user={selectedUser}
          onClose={() => setShowDetailModal(false)}
          onActivate={handleActivateWithModal}
          onDeactivate={handleDeactivateWithModal}
          formatDateTime={formatDateTime}
          getStatusBadge={getStatusBadge}
          getAktivasiBadge={getAktivasiBadge}
        />
      )}
    </MainLayout>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
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