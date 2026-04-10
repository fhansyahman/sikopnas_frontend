'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import IzinManagement from '@/components/atasan/izin';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>
          <main>
            <IzinManagement />
          </main>
    </ProtectedRoute>
  );
}