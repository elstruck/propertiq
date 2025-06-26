import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Target, 
  BarChart3, 
  Plus,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Buy Boxes', href: '/dashboard/buy-boxes', icon: Target },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function SignOutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    >
      <LogOut className="w-5 h-5 mr-3" />
      Sign Out
    </Button>
  );
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col w-64 bg-white border-r border-gray-200 ${className}`}>
      {/* ProperTiQ Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-gray-900">
            Proper<span className="text-blue-600">TiQ</span>
          </h1>
        </Link>
      </div>

      {/* New Buy Box Button */}
      <div className="p-4 border-b border-gray-200">
        <Button asChild className="w-full">
                          <Link href="/dashboard/buy-boxes/create">
            <Plus className="w-4 h-4 mr-2" />
            New Buy Box
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-gray-200">
        <SignOutButton />
      </div>
    </div>
  );
} 