import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { RESET_PASSWORD } from '@/graphql/queries/auth';

import type { ResetPasswordInput } from '@/gql/graphql';

export function useResetPassword() {
  const [resetMutation, { loading, error: mutationError }] =
    useMutation(RESET_PASSWORD);

  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (input: ResetPasswordInput) => {
    try {
      setError(null);

      const { data } = await resetMutation({
        variables: { input },
      });

      if (data?.resetPassword) {
        return data.resetPassword;
      }

      setError('Failed to reset password');
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      return null;
    }
  };

  return {
    resetPassword,
    loading,
    error: error || mutationError?.message || null,
  };
}
