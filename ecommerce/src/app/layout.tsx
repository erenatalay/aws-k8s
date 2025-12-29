'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import { ApolloProvider } from '@apollo/client/react';

import { AuthProvider } from '@/context/AuthContext';
import { apolloClient } from '@/lib/apolloClient';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>GraphQL Commerce</title>
        <meta name="description" content="Next.js App Router + GraphQL UI" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ApolloProvider client={apolloClient}>
          <AuthProvider>{children}</AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
