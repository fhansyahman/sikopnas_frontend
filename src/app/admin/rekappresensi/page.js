'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import AdminPresensiRekap from '@/components/admin/Adminrekappresensi';

export default function AdminPresensiRekapPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <AdminPresensiRekap />
          </main>

    </ProtectedRoute>
  );
}