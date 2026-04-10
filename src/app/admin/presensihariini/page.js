'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import AdminPresensi from '@/components/admin/AdminPresensi';

export default function AdminPresensiPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <AdminPresensi />
          </main>

    </ProtectedRoute>
  );
}