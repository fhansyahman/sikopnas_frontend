'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import PemutihanRoute from '@/components/admin/Adminpemutihan';

export default function ManajemenWilayahPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <PemutihanRoute />
          </main>

    </ProtectedRoute>
  );
}