import { useQuery } from '@apollo/client/react';

import type {
  GetUserQuery,
  GetUserQueryVariables,
} from '@/graphql/generated/graphql';
import { GET_USER } from '@/graphql/operations/auth';

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
