import { useQuery } from '@apollo/client/react';

import type {} from '@/graphql/generated';
import {
  GetProductsQuery,
  GetProductsQueryVariables,
} from '@/graphql/generated/graphql';
import { GET_PRODUCTS } from '@/graphql/operations/products';

export function useProducts(queryInput?: GetProductsQueryVariables['query']) {
  const { data, loading, error, refetch } = useQuery<
    GetProductsQuery,
    GetProductsQueryVariables
  >(GET_PRODUCTS, {
    variables: { query: queryInput },
  });

  return {
    products: data?.products?.data || [],
    total: data?.products?.total || 0,
    page: data?.products?.page || 1,
    limit: data?.products?.limit || 10,
    totalPages: data?.products?.totalPages || 0,
    loading,
    error: error?.message || null,
    refetch,
  };
}
