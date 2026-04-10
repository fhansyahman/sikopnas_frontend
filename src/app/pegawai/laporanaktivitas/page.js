'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import AkitivitasPegawai from '@/components/pegawai/AktivitasPegawai';

export default function AkitivitasPegawaiPage() {
  return (
    <ProtectedRoute allowedRoles={['pegawai']}>
          <main>
            <AkitivitasPegawai />
          </main>
    </ProtectedRoute>
  );
}