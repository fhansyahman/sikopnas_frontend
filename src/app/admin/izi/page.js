'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import RiwayatIzin from '@/components/admin/Riwayatizin';

export default function RiwayatIzinPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <RiwayatIzin />
          </main>

    </ProtectedRoute>
  );
}