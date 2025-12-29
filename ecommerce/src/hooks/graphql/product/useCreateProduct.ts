import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { CREATE_PRODUCT, GET_PRODUCTS } from '@/graphql/operations/products';

import type {
  CreateProductInput,
  CreateProductMutation,
  CreateProductMutationVariables,
} from '@/graphql/generated';

export function useCreateProduct() {
  const [createProductMutation, { loading, error: mutationError }] =
    useMutation<CreateProductMutation, CreateProductMutationVariables>(
      CREATE_PRODUCT,
      {
        refetchQueries: [{ query: GET_PRODUCTS }],
        awaitRefetchQueries: true,
      },
    );

  const [error, setError] = useState<string | null>(null);

  const createProduct = async (input: CreateProductInput) => {
    try {
      setError(null);

      const { data } = await createProductMutation({
        variables: {
          input: {
            name: input.name,
            description: input.description || '',
            price: input.price,
          },
        },
      });

      if (data?.createProduct) {
        return data.createProduct;
      }

      setError('Failed to create product');
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      return null;
    }
  };

  return {
    createProduct,
    loading,
    error: error || mutationError?.message || null,
  };
}
