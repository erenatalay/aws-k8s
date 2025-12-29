import { useQuery } from '@apollo/client/react';

import { GET_PRODUCT } from '@/graphql/queries/products';

import type { GetProductQuery, GetProductQueryVariables } from '@/gql/graphql';

export function useProduct(id: string) {
  const { data, loading, error, refetch } = useQuery<
    GetProductQuery,
    GetProductQueryVariables
  >(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  return {
    product: data?.product || null,
    loading,
    error: error?.message || null,
    refetch,
  };
}
