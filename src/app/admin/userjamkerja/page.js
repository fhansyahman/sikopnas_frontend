'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserJamKerjaManagement from '@/components/admin/AdminJamKerja';

export default function UserJamKerjaManagementPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
          <main>
            <UserJamKerjaManagement />
          </main>
    </ProtectedRoute>
  );
}