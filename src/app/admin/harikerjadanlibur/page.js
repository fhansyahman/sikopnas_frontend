'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import ManajemenHariRoutes from '@/components/admin/ManajemenHari';

export default function ManajemenHariPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <ManajemenHariRoutes />
          </main>

    </ProtectedRoute>
  );
}