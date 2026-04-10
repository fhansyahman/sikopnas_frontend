'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import AdminPresensi from '@/components/atasan/AdminPresensi';

export default function AdminPresensiPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>

          <main>
            <AdminPresensi />
          </main>

    </ProtectedRoute>
  );
}