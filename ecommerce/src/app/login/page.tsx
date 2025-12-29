'use client';
import { useState } from 'react';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FormField } from '@/components/forms/FormField';
import { Navbar } from '@/components/shell/navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/lib/graphql/auth';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const result = await login({
        email: values.email,
        password: values.password,
      });
      setSubmitSuccess(`Welcome back, ${result.firstname}!`);

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
    } catch (error: any) {
      console.error('Login error:', error);
      setSubmitError(error?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col gap-8 px-4 py-12">
        <Card className="border-white/10 bg-white/5 text-slate-50">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription className="text-slate-300">
              Sign in to your account to manage your products.
            </CardDescription>
          </CardHeader>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 px-6 pb-4">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                />

                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                />

                {/* Messages */}
                {submitSuccess && (
                  <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400">
                    {submitSuccess}
                  </div>
                )}

                {submitError && (
                  <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-slate-400 hover:text-emerald-400"
                  >
                    Forgot password?
                  </Link>
                </div>
              </Form>
            )}
          </Formik>

          <CardFooter className="justify-between border-t border-white/10 text-sm text-slate-300">
            <span>Don&apos;t have an account?</span>
            <Link href="/register" className="text-emerald-400 hover:underline">
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
