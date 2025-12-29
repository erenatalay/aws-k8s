'use client';
import { useState } from 'react';
import { Form, Formik } from 'formik';
import { ArrowLeft, Key, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FormField } from '@/components/forms/FormField';
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
import { useChangePassword } from '@/hooks';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/lib/validations/auth';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { changePassword: changePasswordMutation } = useChangePassword();

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

  const initialValues: ChangePasswordFormValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (
    values: ChangePasswordFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await changePasswordMutation({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSubmitSuccess(true);
      resetForm();
      setTimeout(() => router.push('/profile'), 2000);
    } catch (error: any) {
      setSubmitError(error?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Change Password</h1>
            <p className="text-slate-400">Update your account password</p>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="border-amber-500/20 bg-amber-500/5 text-slate-50">
          <CardContent className="flex items-start gap-3 p-4">
            <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-400">Security Notice</p>
              <p className="text-slate-400">
                Make sure to use a strong password that you don&apos;t use
                elsewhere. A good password is at least 8 characters long and
                includes a mix of letters, numbers, and symbols.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="border-white/10 bg-white/5 text-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-emerald-500" />
              Password Settings
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your current password and choose a new one
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={changePasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, dirty, isValid }) => (
                <Form className="space-y-6">
                  <FormField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                  />

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-sm font-medium text-slate-300 mb-4">
                      New Password
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                      />

                      <FormField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  {submitSuccess && (
                    <div className="rounded-lg bg-emerald-500/10 p-4 text-emerald-400">
                      <p className="font-medium">
                        Password changed successfully!
                      </p>
                      <p className="text-sm mt-1">
                        Redirecting to your profile...
                      </p>
                    </div>
                  )}

                  {submitError && (
                    <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
                      {submitError}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !dirty || !isValid}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4" />
                          Change Password
                        </>
                      )}
                    </Button>

                    <Link href="/profile">
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
