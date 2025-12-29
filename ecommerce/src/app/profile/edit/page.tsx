'use client';
import { useState } from 'react';
import { Form, Formik } from 'formik';
import { ArrowLeft, Save } from 'lucide-react';
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
import { profileSchema, type ProfileFormValues } from '@/lib/validations/auth';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const initialValues: ProfileFormValues = {
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    phone: user.phone || '',
    avatar: user.avatar || '',
  };

  const handleSubmit = async (
    values: ProfileFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // TODO: GraphQL mutation call
      // const result = await updateUserMutation({ ...values, uuid: user.id });

      updateUser({
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        phone: values.phone || undefined,
        avatar: values.avatar || undefined,
      });

      setSubmitSuccess(true);
      setTimeout(() => router.push('/profile'), 1500);
    } catch (error: any) {
      setSubmitError(error?.message || 'Update failed');
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
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-slate-400">Update your account information</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-white/10 bg-white/5 text-slate-50">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription className="text-slate-400">
              Fill out the form below to update your profile
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={profileSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, dirty }) => (
                <Form className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="First Name"
                      name="firstname"
                      placeholder="Your first name"
                    />
                    <FormField
                      label="Last Name"
                      name="lastname"
                      placeholder="Your last name"
                    />
                  </div>

                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                  />

                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 555 555 5555"
                  />

                  <FormField
                    label="Avatar URL"
                    name="avatar"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                  />

                  {/* Messages */}
                  {submitSuccess && (
                    <div className="rounded-lg bg-emerald-500/10 p-4 text-emerald-400">
                      Profile updated successfully! Redirecting...
                    </div>
                  )}

                  {submitError && (
                    <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
                      {submitError}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !dirty}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save
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
