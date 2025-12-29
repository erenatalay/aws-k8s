'use client';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProductCardProps {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  onDelete?: (id: string) => void;
  deleting?: boolean;
  isOwner: boolean;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  onDelete,
  deleting,
  isOwner,
}: ProductCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/products/${id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      onDelete(id);
    }
  };

  return (
    <Card
      className="bg-white/5 border-white/10 text-slate-50 hover:bg-white/10 transition-colors cursor-pointer group relative"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription className="text-slate-200 text-lg font-semibold">
              ${price.toFixed(2)}
            </CardDescription>
          </div>
          {isOwner && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <div className="px-6 pb-4 text-slate-200/90 text-sm line-clamp-2">
        {description || 'No description provided.'}
      </div>
    </Card>
  );
}
