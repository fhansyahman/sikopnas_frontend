'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Aktivitaspekerjaroute from '@/components/admin/Adminaktivititas';

export default function AktivitaspekerjaPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
          <main>
            <Aktivitaspekerjaroute />
          </main>
    </ProtectedRoute>
  );
}