import Link from 'next/link';
import { Navbar } from '@/components/shell/navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sparkles, ShieldCheck, Globe } from 'lucide-react';

const benefits = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'GraphQL-first',
    desc: 'Auto-typed requests, single endpoint, predictable data.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Auth built-in',
    desc: 'Cookie-based sessions with middleware guard.',
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: 'Edge aware',
    desc: 'Cache where mümkün, SSR/ISR hibrit akış.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Production-grade GraphQL commerce
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Hızlı GraphQL API, cilalı Next.js UI ile ürünlerinizi öne çıkarın.
            </h1>
            <p className="text-lg text-slate-200/80">
              Login/register, ürün yönetimi, korumalı sayfalar, cache ve
              streaming örnekleri. Tailwind + shadcn tarzı UI kit ile hızla ship
              edin.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/products">Ürünleri keşfet</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/login">Panele giriş</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {benefits.map((b) => (
                <Card
                  key={b.title}
                  className="bg-white/5 border-white/10 text-slate-100"
                >
                  <CardHeader className="flex flex-row items-center gap-2">
                    <div className="rounded-md bg-white/10 p-2 text-emerald-300">
                      {b.icon}
                    </div>
                    <CardTitle className="text-base">{b.title}</CardTitle>
                  </CardHeader>
                  <CardDescription className="px-6 pb-4 text-slate-300/80">
                    {b.desc}
                  </CardDescription>
                </Card>
              ))}
            </div>
          </div>
          <Card className="bg-white/5 border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle>Öne çıkan ürün</CardTitle>
              <CardDescription>
                Edge caching + SSR ile hızlı yükleme
              </CardDescription>
            </CardHeader>
            <div className="space-y-4 text-slate-200">
              <div className="aspect-[4/3] w-full rounded-lg bg-gradient-to-br from-emerald-400/50 via-cyan-400/30 to-purple-500/30" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Nebula Headphones</p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                    $199
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Spatial audio, düşük gecikme, GraphQL destekli envanter akışı.
                </p>
              </div>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/products">Sepete ekle</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
