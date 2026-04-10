'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import AtasanPresensirekap from '@/components/atasan/Adminrekapkehadiran';

export default function AdminrekapkehadiranPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>

          <main>
            <AtasanPresensirekap />
          </main>

    </ProtectedRoute>
  );
}