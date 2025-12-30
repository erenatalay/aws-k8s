export interface BaseEvent<T = any> {
  version: string;
  timestamp: Date;
  source: string;
  traceId: string;
  data: T;
}

export const PRODUCT_EVENTS = {
  CREATED: 'product.created.v1',
  UPDATED: 'product.updated.v1',
  DELETED: 'product.deleted.v1',
  PRICE_CHANGED: 'product.price_changed.v1',
  STOCK_UPDATED: 'product.stock_updated.v1',
  OUT_OF_STOCK: 'product.out_of_stock.v1',
} as const;

export type ProductEventType =
  (typeof PRODUCT_EVENTS)[keyof typeof PRODUCT_EVENTS];

export interface ProductCreatedEventData {
  productId: string;
  name: string;
  price: number;
  description?: string;
  userId: string;
  createdAt: Date;
}

export type ProductCreatedEvent = BaseEvent<ProductCreatedEventData>;

export interface ProductUpdatedEventData {
  productId: string;
  changes: {
    name?: string;
    price?: number;
    description?: string;
  };
  updatedBy: string;
  updatedAt: Date;
}

export type ProductUpdatedEvent = BaseEvent<ProductUpdatedEventData>;

export interface ProductDeletedEventData {
  productId: string;
  deletedBy: string;
  deletedAt: Date;
}

export type ProductDeletedEvent = BaseEvent<ProductDeletedEventData>;

export interface ProductPriceChangedEventData {
  productId: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  changedAt: Date;
}

export type ProductPriceChangedEvent = BaseEvent<ProductPriceChangedEventData>;

export function createEvent<T>(
  data: T,
  source: string = 'product-service',
): BaseEvent<T> {
  return {
    version: '1.0.0',
    timestamp: new Date(),
    source,
    traceId: generateTraceId(),
    data,
  };
}

function generateTraceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
