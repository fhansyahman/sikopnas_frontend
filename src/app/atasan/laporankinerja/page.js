'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import LaporanKinerja from '@/components/atasan/Laporankinerja';

export default function ManajemenHariPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>

          <main>
            <LaporanKinerja />
          </main>

    </ProtectedRoute>
  );
}