import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { CHANGE_PASSWORD } from '@/graphql/queries/auth';

import type { ChangePasswordInput } from '@/gql/graphql';

export function useChangePassword() {
  const [changeMutation, { loading, error: mutationError }] =
    useMutation(CHANGE_PASSWORD);

  const [error, setError] = useState<string | null>(null);

  const changePassword = async (input: ChangePasswordInput) => {
    try {
      setError(null);

      const { data } = await changeMutation({
        variables: { input },
      });

      if (data?.changeUserPassword) {
        return data.changeUserPassword;
      }

      setError('Failed to change password');
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      return null;
    }
  };

  return {
    changePassword,
    loading,
    error: error || mutationError?.message || null,
  };
}
