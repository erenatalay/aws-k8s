'use client';

import { Navbar } from '@/components/shell/navbar';
import { ProductForm } from '@/components/products/ProductForm';

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
        <div>
          <h1 className="text-3xl font-semibold">Create New Product</h1>
          <p className="text-slate-300 mt-2">
            Add a new product to your catalog.
          </p>
        </div>
        <ProductForm />
      </main>
    </div>
  );
}
