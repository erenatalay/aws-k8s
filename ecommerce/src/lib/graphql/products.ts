import { gql } from 'graphql-request';
import { gqlRequest, gqlRequestSafe, GraphQLResult } from './clients';
import type {
  Product,
  ProductsResponse,
  MessageResponse,
  CreateProductInput,
  UpdateProductInput,
  QueryProductInput,
} from '@/generated/graphql';

// ============================================
// Fragments
// ============================================

const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on Product {
    id
    name
    description
    price
    userId
    createdAt
    updatedAt
  }
`;

const PRODUCTS_RESPONSE_FRAGMENT = gql`
  ${PRODUCT_FRAGMENT}
  fragment ProductsResponseFields on ProductsResponse {
    data {
      ...ProductFields
    }
    total
    page
    limit
    totalPages
  }
`;

// ============================================
// Mutations
// ============================================

const CREATE_PRODUCT_MUTATION = gql`
  ${PRODUCT_FRAGMENT}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(createProductInput: $input) {
      ...ProductFields
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  ${PRODUCT_FRAGMENT}
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, updateProductInput: $input) {
      ...ProductFields
    }
  }
`;

const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: String!) {
    removeProduct(id: $id) {
      message
    }
  }
`;

// ============================================
// Queries
// ============================================

const GET_PRODUCTS_QUERY = gql`
  ${PRODUCTS_RESPONSE_FRAGMENT}
  query GetProducts($query: QueryProductInput) {
    products(query: $query) {
      ...ProductsResponseFields
    }
  }
`;

const GET_PRODUCT_QUERY = gql`
  ${PRODUCT_FRAGMENT}
  query GetProduct($id: String!) {
    product(id: $id) {
      ...ProductFields
    }
  }
`;

// ============================================
// API Functions - Type Safe
// ============================================

/**
 * Ürün oluştur
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const { createProduct: result } = await gqlRequest<{
    createProduct: Product;
  }>(CREATE_PRODUCT_MUTATION, { input });
  return result;
}

/**
 * Ürün oluştur - Safe version
 */
export async function createProductSafe(
  input: CreateProductInput,
): Promise<GraphQLResult<Product>> {
  const result = await gqlRequestSafe<{ createProduct: Product }>(
    CREATE_PRODUCT_MUTATION,
    { input },
  );
  if (result.success) {
    return { success: true, data: result.data.createProduct };
  }
  return result;
}

/**
 * Ürün güncelle
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const { updateProduct: result } = await gqlRequest<{
    updateProduct: Product;
  }>(UPDATE_PRODUCT_MUTATION, { id, input });
  return result;
}

/**
 * Ürün güncelle - Safe version
 */
export async function updateProductSafe(
  id: string,
  input: UpdateProductInput,
): Promise<GraphQLResult<Product>> {
  const result = await gqlRequestSafe<{ updateProduct: Product }>(
    UPDATE_PRODUCT_MUTATION,
    { id, input },
  );
  if (result.success) {
    return { success: true, data: result.data.updateProduct };
  }
  return result;
}

/**
 * Ürün sil
 */
export async function deleteProduct(id: string): Promise<MessageResponse> {
  const { removeProduct: result } = await gqlRequest<{
    removeProduct: MessageResponse;
  }>(DELETE_PRODUCT_MUTATION, { id });
  return result;
}

/**
 * Ürün sil - Safe version
 */
export async function deleteProductSafe(
  id: string,
): Promise<GraphQLResult<MessageResponse>> {
  const result = await gqlRequestSafe<{ removeProduct: MessageResponse }>(
    DELETE_PRODUCT_MUTATION,
    { id },
  );
  if (result.success) {
    return { success: true, data: result.data.removeProduct };
  }
  return result;
}

/**
 * Ürünleri listele
 */
export async function getProducts(
  query?: QueryProductInput,
): Promise<ProductsResponse> {
  const { products: result } = await gqlRequest<{ products: ProductsResponse }>(
    GET_PRODUCTS_QUERY,
    query ? { query } : undefined,
  );
  return result;
}

/**
 * Ürünleri listele - Safe version
 */
export async function getProductsSafe(
  query?: QueryProductInput,
): Promise<GraphQLResult<ProductsResponse>> {
  const result = await gqlRequestSafe<{ products: ProductsResponse }>(
    GET_PRODUCTS_QUERY,
    query ? { query } : undefined,
  );
  if (result.success) {
    return { success: true, data: result.data.products };
  }
  return result;
}

/**
 * Tek ürün getir
 */
export async function getProduct(id: string): Promise<Product> {
  const { product } = await gqlRequest<{ product: Product }>(
    GET_PRODUCT_QUERY,
    {
      id,
    },
  );
  return product;
}

/**
 * Tek ürün getir - Safe version
 */
export async function getProductSafe(
  id: string,
): Promise<GraphQLResult<Product>> {
  const result = await gqlRequestSafe<{ product: Product }>(GET_PRODUCT_QUERY, {
    id,
  });
  if (result.success) {
    return { success: true, data: result.data.product };
  }
  return result;
}

// ============================================
// Server-side API Functions
// ============================================

/**
 * Server-side ürünleri listele
 */
export async function getProductsServer(
  query?: QueryProductInput,
  token?: string,
): Promise<ProductsResponse> {
  const { products: result } = await gqlRequest<{ products: ProductsResponse }>(
    GET_PRODUCTS_QUERY,
    query ? { query } : undefined,
    { token, isServer: true },
  );
  return result;
}

/**
 * Server-side tek ürün getir
 */
export async function getProductServer(
  id: string,
  token?: string,
): Promise<Product> {
  const { product } = await gqlRequest<{ product: Product }>(
    GET_PRODUCT_QUERY,
    { id },
    { token, isServer: true },
  );
  return product;
}
