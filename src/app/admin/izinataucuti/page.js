'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import IzinManagement from '@/components/admin/izin';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
          <main>
            <IzinManagement />
          </main>
    </ProtectedRoute>
  );
}