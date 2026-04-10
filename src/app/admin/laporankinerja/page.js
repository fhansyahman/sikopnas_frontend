'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import LaporanKinerja from '@/components/admin/Laporankinerja';

export default function ManajemenHariPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <LaporanKinerja />
          </main>

    </ProtectedRoute>
  );
}