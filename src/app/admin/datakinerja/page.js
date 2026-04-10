'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import KinerjaHarian from '@/components/admin/KinerjaHarian';

export default function KinerjaHarianPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <KinerjaHarian />
          </main>

    </ProtectedRoute>
  );
}