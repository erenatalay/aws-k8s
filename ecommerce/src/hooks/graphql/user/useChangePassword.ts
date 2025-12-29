import { useMutation } from '@apollo/client/react';

import { ChangePasswordInput, User } from '@/graphql/generated/graphql';
import { CHANGE_PASSWORD } from '@/graphql/operations/auth';

type ChangePasswordData = { changeUserPassword: User };

export function useChangePassword() {
  const [changeMutation, { loading, error: mutationError }] =
    useMutation<ChangePasswordData>(CHANGE_PASSWORD);

  const changePassword = async (input: ChangePasswordInput): Promise<User> => {
    const { data, error } = await changeMutation({
      variables: { input },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.changeUserPassword) {
      throw new Error('Failed to change password');
    }

    return data.changeUserPassword;
  };

  return {
    changePassword,
    loading,
    error: mutationError?.message || null,
  };
}
