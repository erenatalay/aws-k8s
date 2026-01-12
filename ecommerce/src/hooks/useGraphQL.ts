'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AppGraphQLError, ErrorCode } from '@/lib/graphql/error-codes';


interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: AppGraphQLError | null;
}


interface UseMutationReturn<T, V> {
  mutate: (variables: V) => Promise<T | null>;
  data: T | null;
  loading: boolean;
  error: AppGraphQLError | null;
  reset: () => void;
}


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


interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: AppGraphQLError | null;
}


interface UseQueryOptions<V> {
  variables?: V;
  skip?: boolean;
  onCompleted?: (data: any) => void;
  onError?: (error: AppGraphQLError) => void;
}


interface UseQueryReturn<T, V> {
  data: T | null;
  loading: boolean;
  error: AppGraphQLError | null;
  refetch: (newVariables?: V) => Promise<T | null>;
}


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


export function useErrorHandler() {
  const handleError = useCallback((error: AppGraphQLError) => {

    if (error.isAuthError()) {

      if (typeof window !== 'undefined') {
        document.cookie = 'accessToken=; Max-Age=0; path=/';
        document.cookie = 'refreshToken=; Max-Age=0; path=/';

        if (error.code === ErrorCode.UNAUTHENTICATED) {
          window.location.href = '/login';
        }
      }
    }


    return error.getUserFriendlyMessage();
  }, []);

  return { handleError };
}
