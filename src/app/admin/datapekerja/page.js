'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import UsersManagement from '@/components/admin/AdminDataPekerja';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
          <main>
            <UsersManagement />
          </main>
    </ProtectedRoute>
  );
}