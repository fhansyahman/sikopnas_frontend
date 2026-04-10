"use client";

import { MainLayout } from "./components/datapekerja/MainLayout";
import { StatsCards } from "./components/datapekerja/StatsCards";
import { UserFilters } from "./components/datapekerja/UserFilters";
import { UserTable } from "./components/datapekerja//UserTable";
import { UserModal } from "./components/datapekerja/UserModal";
import { UserPagination } from "./components/datapekerja/UserPagination";
import { DetailModal } from "./components/datapekerja/DetailModel";
import { PasswordModal } from "./components/datapekerja/PasswordModal";
import { LoadingSpinner } from "./components/datapekerja/LoadingSpinner";
import { ErrorAlert } from "./components/datapekerja/ErrorAlert";
import { useUsers } from "../admin/hooks/useUsers";
import { useFilters } from "../admin/hooks/useFilters";
import { usePagination } from "../admin/hooks/usePagination";
import { useSidebar } from "../admin/hooks/useSidebar";
import { ConfirmationDialog } from "./components/datapekerja/ConfirmationDialog";
export default function UsersManagement() {
  const {
    users,
    loading,
    error,
    selectedUser,
    showModal,
    showDetailModal,
    showPasswordModal,
    showConfirmDialog,
    userToDelete,
    isDeleting,
    editingUser,
    formData,
    passwordData,
    setShowModal,
    setShowDetailModal,
    setShowPasswordModal,
    setShowConfirmDialog,
    setUserToDelete,
    setSelectedUser,
    setFormData,
    setPasswordData,
    loadUsers,
    handleSubmit,
    handleDelete,
    confirmDelete,
    handlePasswordChange,
    handleShowEditModal,
    handleShowPasswordModal,
    handleViewDetail,
    handleFileChange,
    resetForm
  } = useUsers();

  const {
    search,
    statusFilter,
    roleFilter,
    filteredUsers,
    setSearch,
    setStatusFilter,
    setRoleFilter
  } = useFilters(users);

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedUsers,
    startIndex,
    itemsPerPage,
    setCurrentPage
  } = usePagination(filteredUsers, 10);

  const { sidebarOpen, setSidebarOpen, handleLogout } = useSidebar();

  if (loading) {
    return <LoadingSpinner message="Memuat data pengguna..." />;
  }

  return (
    <MainLayout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
      onLogout={handleLogout}
      title="Manajemen Pekerja"
    >
      {error && <ErrorAlert error={error} onRetry={loadUsers} />}

      <StatsCards 
        totalUsers={users.length}
        activeUsers={users.filter(u => u.is_active).length}
        inactiveUsers={users.filter(u => !u.is_active).length}
      />

      <UserFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onAddUser={() => {
          resetForm();
          setShowModal(true);
        }}
      />

      <UserTable
        users={paginatedUsers}
        onViewDetail={handleViewDetail}
        onEdit={handleShowEditModal}
        onResetPassword={handleShowPasswordModal}
        onDelete={handleDelete}  // Pastikan ini mengirim handleDelete
      />

      {totalPages > 1 && (
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={Math.min(startIndex + itemsPerPage, filteredUsers.length)}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        editingUser={editingUser}
        onSubmit={handleSubmit}
        onFileChange={handleFileChange}
      />

      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        user={selectedUser}
        onEdit={() => {
          setShowDetailModal(false);
          handleShowEditModal(selectedUser);
        }}
      />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        user={selectedUser}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        onSubmit={handlePasswordChange}
      />

      {/* Confirmation Dialog untuk Delete */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message={`Yakin ingin menghapus "${userToDelete?.nama}"?`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
        isLoading={isDeleting}
      />
    </MainLayout>
  );
}