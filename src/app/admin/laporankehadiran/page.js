'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import LaporanKehadiran from '@/components/admin/Adminrekapkehadiran';

export default function LaporanKehadiranPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <LaporanKehadiran />
          </main>

    </ProtectedRoute>
  );
}