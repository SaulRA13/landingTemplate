'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { LogOut, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/admin/dashboard">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank">
              <Home className="mr-2 h-4 w-4" />
              View Site
            </Link>
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
