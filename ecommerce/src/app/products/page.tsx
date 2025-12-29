'use client';
import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ProductCard } from '@/components/products/ProductCard';
import { Navbar } from '@/components/shell/navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDeleteProduct, useProducts } from '@/hooks';

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { products, loading, error } = useProducts();
  const { deleteProduct, loading: deleting } = useDeleteProduct();
  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />e
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Products</h1>
            <p className="text-slate-300">
              Fetched from your Product GraphQL service.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/products/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
          </div>
        </div>

        {loading && !products.length && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        )}

        {error && (
          <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                onDelete={handleDelete}
                deleting={deleting}
                isOwner={item.userId === user?.id || false}
              />
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400">
                <p className="text-lg">No products found.</p>
                <p className="text-sm mt-2">
                  Create your first product to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
