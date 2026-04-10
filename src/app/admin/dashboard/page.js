'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/admin/dashboard';

export default function AktivitaspekerjaPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
          <main>
            <Dashboard/>
          </main>
    </ProtectedRoute>
  );
}