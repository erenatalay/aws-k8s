import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import type {
  UpdateProductInput,
  UpdateProductMutation,
  UpdateProductMutationVariables,
} from '@/graphql/generated/graphql';
import {
  UPDATE_PRODUCT,
  GET_PRODUCTS,
  GET_PRODUCT,
} from '@/graphql/operations/products';

export function useUpdateProduct() {
  const [updateProductMutation, { loading, error: mutationError }] =
    useMutation<UpdateProductMutation, UpdateProductMutationVariables>(
      UPDATE_PRODUCT,
      {
        refetchQueries: [{ query: GET_PRODUCTS }],
        awaitRefetchQueries: true,
      },
    );

  const [error, setError] = useState<string | null>(null);

  const updateProduct = async (id: string, input: UpdateProductInput) => {
    try {
      setError(null);

      const { data } = await updateProductMutation({
        variables: {
          id,
          input,
        },
        refetchQueries: [
          { query: GET_PRODUCTS },
          { query: GET_PRODUCT, variables: { id } },
        ],
      });

      if (data?.updateProduct) {
        return data.updateProduct;
      }

      setError('Failed to update product');
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      return null;
    }
  };

  return {
    updateProduct,
    loading,
    error: error || mutationError?.message || null,
  };
}
