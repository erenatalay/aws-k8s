import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { REGISTER_USER } from '@/graphql/queries/auth';

import type {
  RegisterInput,
  RegisterMutation,
  RegisterMutationVariables,
} from '@/gql/graphql';

export function useRegister() {
  const [registerMutation, { loading, error: mutationError }] = useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(REGISTER_USER);

  const [error, setError] = useState<string | null>(null);

  const register = async (input: RegisterInput) => {
    try {
      setError(null);

      const { data } = await registerMutation({
        variables: { input },
      });

      if (data?.register) {
        return data.register;
      }

      setError('Registration failed');
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return null;
    }
  };

  return {
    register,
    loading,
    error: error || mutationError?.message || null,
  };
}
