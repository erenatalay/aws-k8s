import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import type {
  VerifyAccountInput,
  MessageResponse,
} from '@/graphql/generated/graphql';
import { VERIFY_ACCOUNT } from '@/graphql/operations/auth';

type VerifyAccountData = { verifyAccount: MessageResponse };

export function useVerifyAccount() {
  const [verifyMutation, { loading, error: mutationError }] =
    useMutation<VerifyAccountData>(VERIFY_ACCOUNT);

  const [error, setError] = useState<string | null>(null);

  const verifyAccount = async (input: VerifyAccountInput) => {
    try {
      setError(null);

      const { data } = await verifyMutation({
        variables: { input },
      });

      if (data?.verifyAccount) {
        return data.verifyAccount;
      }

      setError('Verification failed');
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      return null;
    }
  };

  return {
    verifyAccount,
    loading,
    error: error || mutationError?.message || null,
  };
}
