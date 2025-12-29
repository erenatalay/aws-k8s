import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { DELETE_PRODUCT, GET_PRODUCTS } from '@/graphql/queries/products';

import type {
  DeleteProductMutation,
  DeleteProductMutationVariables,
} from '@/gql/graphql';

export function useDeleteProduct() {
  const [deleteProductMutation, { loading, error: mutationError }] =
    useMutation<DeleteProductMutation, DeleteProductMutationVariables>(
      DELETE_PRODUCT,
      {
        refetchQueries: [{ query: GET_PRODUCTS }],
        awaitRefetchQueries: true,
      },
    );

  const [error, setError] = useState<string | null>(null);

  const deleteProduct = async (id: string) => {
    try {
      setError(null);

      const { data } = await deleteProductMutation({
        variables: { id },
        update: (cache) => {
          cache.evict({ id: `Product:${id}` });
          cache.gc();
        },
      });

      if (data?.removeProduct) {
        return true;
      }

      setError('Failed to delete product');
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      return false;
    }
  };

  return {
    deleteProduct,
    loading,
    error: error || mutationError?.message || null,
  };
}
