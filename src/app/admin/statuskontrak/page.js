'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import PekerjeAktif from '@/components/admin/Adminaktifuser';

export default function PekerjeAktifPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>

          <main>
            <PekerjeAktif />
          </main>

    </ProtectedRoute>
  );
}