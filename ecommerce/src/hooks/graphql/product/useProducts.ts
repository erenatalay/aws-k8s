import { useQuery } from '@apollo/client/react';

import { GET_PRODUCTS } from '@/graphql/queries/products';

import type {
  GetProductsQuery,
  GetProductsQueryVariables,
} from '@/gql/graphql';

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
