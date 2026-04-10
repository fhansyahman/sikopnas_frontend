'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import AdminPresensirekap from '@/components/admin/Adminrekapkehadiran';

export default function AdminrekapkehadiranPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <AdminPresensirekap />
          </main>

    </ProtectedRoute>
  );
}