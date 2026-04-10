'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// ... import dan menuItems sebelumnya

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: ['admin', 'atasan', 'pegawai']
  },
  {
    name: 'Presensi',
    href: '/pegawai/presensi',
    icon: CalendarIcon,
    roles: ['pegawai']
  },
  {
    name: 'Aktivitas',
    href: '/pegawai/aktivitas',
    icon: ClipboardDocumentListIcon,
    roles: ['pegawai']
  },
  {
    name: 'Izin',
    href: '/izin',
    icon: ChartBarIcon,
    roles: ['pegawai']
  },
  {
    name: 'Manajemen User',
    href: '/admin/users',
    icon: UsersIcon,
    roles: ['admin']
  },
  {
    name: 'Manajemen Presensi',
    href: '/admin/presensi',
    icon: CalendarIcon,
    roles: ['admin']
  },
  {
    name: 'Approval Izin',
    href: '/admin/izin',
    icon: ClipboardDocumentListIcon,
    roles: ['admin', 'atasan']
  }
];

// ... sisanya tetap
export default function Sidebar() {
  const { user, hasRole } = useAuth();
  const pathname = usePathname();

  const filteredMenuItems = menuItems.filter(item => 
    hasRole(item.roles)
  );

  const getBasePath = (href) => {
    if (user?.roles === 'admin') return `/admin${href}`;
    if (user?.roles === 'atasan') return `/atasan${href}`;
    if (user?.roles === 'pegawai') return `/pegawai${href}`;
    return href;
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Menu</h2>
      </div>
      <nav className="mt-4">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const href = getBasePath(item.href);
          const isActive = pathname === href;

          return (
            <Link
              key={item.name}
              href={href}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}