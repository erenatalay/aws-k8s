import { useQuery } from '@apollo/client/react';

import { GET_USER } from '@/graphql/operations/auth';

import type { GetUserQuery, GetUserQueryVariables } from '@/graphql/generated';

export function useUser(uuid: string) {
  const { data, loading, error, refetch } = useQuery<
    GetUserQuery,
    GetUserQueryVariables
  >(GET_USER, {
    variables: { uuid },
    skip: !uuid,
  });

  return {
    user: data?.user || null,
    loading,
    error: error?.message || null,
    refetch,
  };
}
