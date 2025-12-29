'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCreateProduct } from '@/hooks';

import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export function ProductForm() {
  const router = useRouter();
  const { createProduct, loading, error } = useCreateProduct();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productInput = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
    };

    const success = await createProduct(productInput);

    if (success) {
      router.push('/products');
    }
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.price.trim() !== '' &&
    !isNaN(parseFloat(formData.price)) &&
    parseFloat(formData.price) > 0;

  return (
    <Card className="bg-white/5 border-white/10 text-slate-50">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
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
              variant="default"
              onClick={() => router.push('/products')}
              disabled={loading}
              className="bg-white/5 border-white/20 text-slate-50 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
