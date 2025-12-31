'use client';
import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ProductCard } from '@/components/products/ProductCard';
import { Navbar } from '@/components/shell/navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useDeleteProduct } from '@/hooks';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const { deleteProduct, loading: deleting } = useDeleteProduct();

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    // Silinen ürünü listeden kaldır
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
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
              onClick={handleRefresh}
              variant="ghost"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => router.push('/products/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
          </div>
        </div>

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
      </main>
    </div>
  );
}
