'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import IzinPegawai from '@/components/pegawai/IzinPegawai';

export default function IzinPegawaiPage() {
  return (
    <ProtectedRoute allowedRoles={['pegawai']}>
          <main>
            <IzinPegawai />
          </main>
    </ProtectedRoute>
  );
}