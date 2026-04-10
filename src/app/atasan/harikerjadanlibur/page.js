'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import ManajemenHariRoutes from '@/components/atasan/ManajemenHari';

export default function ManajemenHariPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>

          <main>
            <ManajemenHariRoutes />
          </main>

    </ProtectedRoute>
  );
}