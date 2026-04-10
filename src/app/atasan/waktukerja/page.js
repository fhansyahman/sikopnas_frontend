'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import JamKerjaManagement from '@/components/atasan/jamkerja';
import UsersManagement from '@/components/admin/jamkerja';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>
          <main>
            <JamKerjaManagement />
          </main>
    </ProtectedRoute>
  );
}