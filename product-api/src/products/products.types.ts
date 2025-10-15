export enum AuthProviderEnum {
  GOOGLE = 'google',
  APPLE = 'apple',
  DEFAULT = 'default',
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilter {
  search?: string;
  userId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface DeleteResponse {
  message: string;
}

export interface CountResponse {
  count: number;
}
