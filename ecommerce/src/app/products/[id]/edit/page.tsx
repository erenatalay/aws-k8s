'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Navbar } from '@/components/shell/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProduct, useUpdateProduct } from '@/hooks';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    product,
    loading: productLoading,
    error: productError,
  } = useProduct(id);
  const {
    updateProduct,
    loading: updating,
    error: updateError,
  } = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  // Product yüklendiğinde formu doldur
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
    };

    const result = await updateProduct(id, input);

    if (result) {
      router.push(`/products/${id}`);
    }
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.price.trim() !== '' &&
    !isNaN(parseFloat(formData.price)) &&
    parseFloat(formData.price) >= 0;

  const error = productError || updateError;

  if (productLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </main>
      </div>
    );
  }

  if (!product && !productLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg">Product not found.</p>
          </div>
          <Button
            variant="secondary"
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
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push(`/products/${id}`)}
            className="text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Button>
        </div>

        {/* Edit Form */}
        <Card className="bg-white/5 border-white/10 text-slate-50">
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="bg-white/10 border-white/20 text-slate-50 placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  className="bg-white/10 border-white/20 text-slate-50 placeholder:text-slate-400 min-h-[100px]"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price * ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bg-white/10 border-white/20 text-slate-50 placeholder:text-slate-400"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-md p-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(`/products/${id}`)}
                  disabled={updating}
                  className="border-white/20 text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || updating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
