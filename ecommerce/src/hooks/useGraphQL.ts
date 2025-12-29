'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AppGraphQLError, ErrorCode } from '@/lib/graphql/error-codes';

/**
 * GraphQL mutation hook state
 */
interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: AppGraphQLError | null;
}

/**
 * GraphQL mutation hook return type
 */
interface UseMutationReturn<T, V> {
  mutate: (variables: V) => Promise<T | null>;
  data: T | null;
  loading: boolean;
  error: AppGraphQLError | null;
  reset: () => void;
}

/**
 * GraphQL mutation hook
 *
 * @example
 * const { mutate, loading, error } = useMutation(loginSafe);
 *
 * const handleLogin = async () => {
 *   const result = await mutate({ email, password });
 *   if (result) {
 *     // Success
 *   }
 * };
 */
export function useMutation<T, V>(
  mutationFn: (
    variables: V,
  ) => Promise<
    { success: true; data: T } | { success: false; error: AppGraphQLError }
  >,
): UseMutationReturn<T, V> {
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: V): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const result = await mutationFn(variables);

      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
        return result.data;
      } else {
        setState({ data: null, loading: false, error: result.error });
        return null;
      }
    },
    [mutationFn],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { mutate, ...state, reset };
}

/**
 * GraphQL query hook state
 */
interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: AppGraphQLError | null;
}

/**
 * GraphQL query hook options
 */
interface UseQueryOptions<V> {
  variables?: V;
  skip?: boolean;
  onCompleted?: (data: any) => void;
  onError?: (error: AppGraphQLError) => void;
}

/**
 * GraphQL query hook return type
 */
interface UseQueryReturn<T, V> {
  data: T | null;
  loading: boolean;
  error: AppGraphQLError | null;
  refetch: (newVariables?: V) => Promise<T | null>;
}

/**
 * GraphQL query hook
 *
 * @example
 * const { data, loading, error, refetch } = useQuery(
 *   getProductsSafe,
 *   { variables: { query: { page: 1, limit: 10 } } }
 * );
 */
export function useQuery<T, V = void>(
  queryFn: (
    variables: V,
  ) => Promise<
    { success: true; data: T } | { success: false; error: AppGraphQLError }
  >,
  options?: UseQueryOptions<V>,
): UseQueryReturn<T, V> {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: !options?.skip,
    error: null,
  });

  const variablesRef = useRef(options?.variables);
  const skipRef = useRef(options?.skip);

  const fetchData = useCallback(
    async (variables?: V): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const result = await queryFn(variables as V);

      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
        options?.onCompleted?.(result.data);
        return result.data;
      } else {
        setState({ data: null, loading: false, error: result.error });
        options?.onError?.(result.error);
        return null;
      }
    },
    [queryFn, options],
  );

  useEffect(() => {
    if (!skipRef.current) {
      fetchData(variablesRef.current);
    }
  }, []);

  const refetch = useCallback(
    async (newVariables?: V): Promise<T | null> => {
      return fetchData(newVariables ?? variablesRef.current);
    },
    [fetchData],
  );

  return { ...state, refetch };
}

/**
 * Lazy query hook - manuel tetikleme için
 *
 * @example
 * const { execute, data, loading } = useLazyQuery(getProductSafe);
 *
 * const handleClick = () => {
 *   execute('product-id');
 * };
 */
export function useLazyQuery<T, V>(
  queryFn: (
    variables: V,
  ) => Promise<
    { success: true; data: T } | { success: false; error: AppGraphQLError }
  >,
): UseQueryReturn<T, V> & { execute: (variables?: V) => Promise<T | null> } {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (variables?: V): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const result = await queryFn(variables as V);

      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
        return result.data;
      } else {
        setState({ data: null, loading: false, error: result.error });
        return null;
      }
    },
    [queryFn],
  );

  const refetch = execute;

  return { ...state, execute, refetch };
}

/**
 * Error handler hook - Hata durumlarını yönetir
 */
export function useErrorHandler() {
  const handleError = useCallback((error: AppGraphQLError) => {
    // Auth hataları için özel işlem
    if (error.isAuthError()) {
      // Token'ı temizle ve login sayfasına yönlendir
      if (typeof window !== 'undefined') {
        document.cookie = 'accessToken=; Max-Age=0; path=/';
        document.cookie = 'refreshToken=; Max-Age=0; path=/';

        if (error.code === ErrorCode.UNAUTHENTICATED) {
          window.location.href = '/login';
        }
      }
    }

    // Kullanıcıya gösterilebilir mesaj döndür
    return error.getUserFriendlyMessage();
  }, []);

  return { handleError };
}
