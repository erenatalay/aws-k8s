import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import type {
  ForgotPasswordInput,
  MessageResponse,
} from '@/graphql/generated/graphql';
import { FORGOT_PASSWORD } from '@/graphql/operations/auth';

type ForgotPasswordData = { forgotPassword: MessageResponse };

export function useForgotPassword() {
  const [forgotMutation, { loading, error: mutationError }] =
    useMutation<ForgotPasswordData>(FORGOT_PASSWORD);

  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (input: ForgotPasswordInput) => {
    try {
      setError(null);

      const { data } = await forgotMutation({
        variables: { input },
      });

      if (data?.forgotPassword) {
        return data.forgotPassword;
      }

      setError('Failed to send reset email');
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      return null;
    }
  };

  return {
    forgotPassword,
    loading,
    error: error || mutationError?.message || null,
  };
}
