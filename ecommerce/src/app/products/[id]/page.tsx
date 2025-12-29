'use client';
import { ArrowLeft, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Navbar } from '@/components/shell/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useDeleteProduct } from '@/hooks/useDeleteProduct';
import { useProduct } from '@/hooks/useProduct';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const { product, loading, error } = useProduct(id);
  const { deleteProduct, loading: deleting } = useDeleteProduct();

  const handleDelete = async () => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      const success = await deleteProduct(id);
      if (success) {
        router.push('/products');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12">
          <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
          <Button
            onClick={() => router.push('/products')}
            className="w-fit border-white/20 text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12">
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg">Product not found.</p>
          </div>
          <Button
            onClick={() => router.push('/products')}
            className="w-fit border-white/20 text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
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
          <Button
            variant="ghost"
            onClick={() => router.push('/products')}
            className="text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          {user?.id === product?.userId && (
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/products/${id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </div>

        {/* Product Details */}
        <Card className="bg-white/5 border-white/10 text-slate-50">
          <CardHeader>
            <CardTitle className="text-3xl">{product.name}</CardTitle>
            <p className="text-3xl font-bold text-blue-400">
              ${product.price.toFixed(2)}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">
                Description
              </h3>
              <p className="text-slate-200">
                {product.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">
                  Product ID
                </h3>
                <p className="text-slate-200 font-mono text-sm">{product.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">
                  Owner ID
                </h3>
                <p className="text-slate-200 font-mono text-sm">
                  {product.userId}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">
                  Created At
                </h3>
                <p className="text-slate-200">
                  {new Date(product.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">
                  Updated At
                </h3>
                <p className="text-slate-200">
                  {new Date(product.updatedAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
