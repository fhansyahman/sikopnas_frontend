'use client';
import ProtectedRoute from '@/components/ProtectedRoute';

import TelegramMassage from '@/components/admin/Telegramsession';

export default function TelegramMassagePage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>
          <main>
            <TelegramMassage />
          </main>
    </ProtectedRoute>
  );
}