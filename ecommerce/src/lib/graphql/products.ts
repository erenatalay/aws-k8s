import { gql } from 'graphql-request';

import type {
  Product,
  ProductsResponse,
  MessageResponse,
  CreateProductInput,
  UpdateProductInput,
  QueryProductInput,
} from '@/graphql/generated/graphql';

import { gqlRequest, gqlRequestSafe, GraphQLResult } from './clients';

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

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const { createProduct: result } = await gqlRequest<{
    createProduct: Product;
  }>(CREATE_PRODUCT_MUTATION, { input });
  return result;
}

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

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const { updateProduct: result } = await gqlRequest<{
    updateProduct: Product;
  }>(UPDATE_PRODUCT_MUTATION, { id, input });
  return result;
}

export async function deleteProduct(id: string): Promise<MessageResponse> {
  const { removeProduct: result } = await gqlRequest<{
    removeProduct: MessageResponse;
  }>(DELETE_PRODUCT_MUTATION, { id });
  return result;
}

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

export async function getProducts(
  query?: QueryProductInput,
): Promise<ProductsResponse> {
  const { products: result } = await gqlRequest<{ products: ProductsResponse }>(
    GET_PRODUCTS_QUERY,
    query ? { query } : undefined,
  );
  return result;
}

export async function getProduct(id: string): Promise<Product> {
  const { product } = await gqlRequest<{ product: Product }>(
    GET_PRODUCT_QUERY,
    {
      id,
    },
  );
  return product;
}

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
