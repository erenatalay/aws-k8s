import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { UPDATE_USER, GET_USER } from '@/graphql/operations/auth';
import type { UpdateUserInput, User } from '@/graphql/generated';

type UpdateUserData = { updateUser: User };

export function useUpdateUser() {
  const [updateMutation, { loading, error: mutationError }] = useMutation<UpdateUserData>(
    UPDATE_USER,
    {
      refetchQueries: (result) => {
        const uuid = result.data?.updateUser?.id;
        return uuid ? [{ query: GET_USER, variables: { uuid } }] : [];
      },
    },
  );

  const [error, setError] = useState<string | null>(null);

  const updateUser = async (input: UpdateUserInput) => {
    try {
      setError(null);

      const { data } = await updateMutation({
        variables: { input },
      });

      if (data?.updateUser) {
        return data.updateUser;
      }

      setError('Failed to update user');
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      return null;
    }
  };

  return {
    updateUser,
    loading,
    error: error || mutationError?.message || null,
  };
}
