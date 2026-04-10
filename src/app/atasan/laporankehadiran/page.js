'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import LaporanKehadiran from '@/components/atasan/Adminrekapkehadiran';

export default function LaporanKehadiranPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>

          <main>
            <LaporanKehadiran />
          </main>

    </ProtectedRoute>
  );
}