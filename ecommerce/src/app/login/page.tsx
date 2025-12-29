'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Navbar } from '@/components/shell/navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/lib/graphql/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await login({ email, password });
      setMessage(`Welcome, ${result.firstname}!`);
      // Save auth state
      setAuthUser(
        {
          id: result.id,
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
        },
        { accessToken: result.accessToken, refreshToken: result.refreshToken },
      );
      setTimeout(() => router.push('/products'), 1500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12">
        <Card className="bg-white/5 border-white/10 text-slate-50">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription className="text-slate-300">
              Access your dashboard and manage products.
            </CardDescription>
          </CardHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-200" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 text-slate-50 border-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 text-slate-50 border-slate-800"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Login'}
            </Button>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>
          <CardFooter className="justify-between text-sm text-slate-300">
            <span>Need an account?</span>
            <Link href="/register" className="text-emerald-300 hover:underline">
              Go to register
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
