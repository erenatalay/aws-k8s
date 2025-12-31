import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import type { MessageResponse } from '@/graphql/generated/graphql';
import { DELETE_USER } from '@/graphql/operations/auth';

type DeleteUserData = { deleteUser: MessageResponse };

export function useDeleteUser() {
  const [deleteMutation, { loading, error: mutationError }] =
    useMutation<DeleteUserData>(DELETE_USER);

  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (uuid: string) => {
    try {
      setError(null);

      const { data } = await deleteMutation({
        variables: { uuid },
      });

      if (data?.deleteUser) {
        return true;
      }

      setError('Failed to delete user');
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      return false;
    }
  };

  return {
    deleteUser,
    loading,
    error: error || mutationError?.message || null,
  };
}
