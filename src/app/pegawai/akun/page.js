'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import PegawaiDashboardAkun from '@/components/pegawai/Pegawaiakun';

export default function PegawaiDashboardAkunPage() {
  return (
    <ProtectedRoute allowedRoles={['pegawai']}>
          <main>
            <PegawaiDashboardAkun />
          </main>
    </ProtectedRoute>
  );
}