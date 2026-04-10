'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import PekerjaanHarian from '@/components/pegawai/KinerjaPegawai';

export default function PekerjaanHarianPage() {
  return (
    <ProtectedRoute allowedRoles={['pegawai']}>
          <main>
            <PekerjaanHarian />
          </main>
    </ProtectedRoute>
  );
}