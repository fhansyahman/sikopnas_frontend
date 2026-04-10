'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import PegawaiDashboard from '@/components/pegawai/PegawaiDashboard';

export default function PegawaiDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['pegawai']}>
          <main>
            <PegawaiDashboard />
          </main>
    </ProtectedRoute>
  );
}