'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import JamKerjaManagement from '@/components/admin/jamkerja';
import UsersManagement from '@/components/admin/jamkerja';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
          <main>
            <JamKerjaManagement />
          </main>
    </ProtectedRoute>
  );
}