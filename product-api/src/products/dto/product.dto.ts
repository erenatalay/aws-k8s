export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  userId: string;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}

export class ProductResponseDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
