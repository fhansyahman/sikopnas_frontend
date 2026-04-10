'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import RiwayatPegawai from '@/components/pegawai/RiwayatPresensiuser';

export default function RiwayatPegawaiPage() {
  return (
    <ProtectedRoute allowedRoles={['pegawai']}>
          <main>
            <RiwayatPegawai />
          </main>
    </ProtectedRoute>
  );
}