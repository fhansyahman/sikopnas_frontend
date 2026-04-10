'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import KinerjaHarian from '@/components/atasan/KinerjaHarian';

export default function KinerjaHarianPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>

          <main>
            <KinerjaHarian />
          </main>

    </ProtectedRoute>
  );
}