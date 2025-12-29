import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import type {
  LoginInput,
  LoginMutation,
  LoginMutationVariables,
} from '@/graphql/generated';
import { LOGIN_USER } from '@/graphql/operations/auth';

export function useLogin() {
  const [loginMutation, { loading, error: mutationError }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_USER);

  const [error, setError] = useState<string | null>(null);

  const login = async (input: LoginInput) => {
    try {
      setError(null);

      const { data } = await loginMutation({
        variables: { input },
      });

      if (data?.login) {
        return data.login;
      }

      setError('Login failed');
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return null;
    }
  };

  return {
    login,
    loading,
    error: error || mutationError?.message || null,
  };
}
