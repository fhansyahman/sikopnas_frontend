'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import ManajemenWilayah from '@/components/admin/ManajemenWilayah';

export default function ManajemenWilayahPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <ManajemenWilayah />
          </main>

    </ProtectedRoute>
  );
}