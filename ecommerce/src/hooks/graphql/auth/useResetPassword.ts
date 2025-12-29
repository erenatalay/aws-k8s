import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import type { ResetPasswordInput, MessageResponse } from '@/graphql/generated';
import { RESET_PASSWORD } from '@/graphql/operations';

type ResetPasswordData = { resetPassword: MessageResponse };

export function useResetPassword() {
  const [resetMutation, { loading, error: mutationError }] =
    useMutation<ResetPasswordData>(RESET_PASSWORD);

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
