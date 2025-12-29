'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
            <ShoppingBag size={18} />
          </div>
          GraphQL Commerce
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/products">Products</Link>
          </Button>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-300">
                Welcome, {user?.firstname}
              </span>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/register" className="flex items-center gap-2">
                  <User size={16} />
                  Join
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
