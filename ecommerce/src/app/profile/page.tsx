'use client';
import { Edit, Key, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';

import { Navbar } from '@/components/shell/navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <main className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-12">
          <p className="text-slate-400">User not found</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-slate-400">View your account information</p>
          </div>
          <Link href="/profile/edit">
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="border-white/10 bg-white/5 text-slate-50">
          <CardHeader className="flex flex-row items-center gap-4">
            {/* Avatar */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstname}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user.firstname.charAt(0)}
                  {user.lastname.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {user.firstname} {user.lastname}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {user.email}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* User Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">
                Personal Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <User className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p>
                      {user.firstname} {user.lastname}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">
                Quick Actions
              </h3>

              <div className="flex flex-col gap-3">
                <Link href="/profile/edit">
                  <Button
                    variant="secondary"
                    className="w-full justify-start gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>

                <Link href="/profile/change-password">
                  <Button
                    variant="secondary"
                    className="w-full justify-start gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Change Password
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-white/10 bg-white/5 text-slate-50">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-3xl font-bold text-emerald-500">0</p>
              <p className="text-sm text-slate-400">Total Products</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-slate-50">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-3xl font-bold text-cyan-500">0</p>
              <p className="text-sm text-slate-400">Sales</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-slate-50">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-3xl font-bold text-purple-500">0</p>
              <p className="text-sm text-slate-400">Favorites</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
