import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'SIKOPNAS - Sistem Informasi Kinerja Operasional Pemantauan Non-ASN Prajekan ',
  description: 'Sistem Informasi Kinerja Operasional Pemantauan Non-ASN Prajekan Kabupaten Bondowoso',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}