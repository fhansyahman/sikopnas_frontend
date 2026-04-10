'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/atasan/dashboard';

export default function AktivitaspekerjaPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>
          <main>
            <Dashboard/>
          </main>
    </ProtectedRoute>
  );
}