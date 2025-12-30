import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';
import Cookies from 'js-cookie';

import { parseGraphQLError, AppGraphQLError } from './error-codes';

export type RequestVars = Variables | undefined;
export type GraphQLCaller = <T>(
  query: RequestDocument,
  variables?: RequestVars,
) => Promise<T>;

const gatewayEndpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

function createClient(token?: string): GraphQLClient {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return new GraphQLClient(gatewayEndpoint, {
    credentials: 'include',
    headers,
  });
}

/**
 * Client-side GraphQL client (cookie'den token alır)
 */
function getClientSideClient(): GraphQLClient {
  const accessToken = Cookies.get('accessToken');
  return createClient(accessToken);
}

/**
 * Server-side GraphQL client (token parametre olarak verilir)
 */
export function getServerSideClient(token?: string): GraphQLClient {
  return createClient(token);
}

/**
 * GraphQL isteği yapan ana fonksiyon
 * Type-safe ve error handling içerir
 */
export async function gqlRequest<TData, TVars extends Variables = Variables>(
  document: RequestDocument,
  variables?: TVars,
  options?: {
    token?: string;
    isServer?: boolean;
  },
): Promise<TData> {
  try {
    const client = options?.isServer
      ? getServerSideClient(options.token)
      : getClientSideClient();

    const data = await client.request<TData>(document, variables);
    return data;
  } catch (error) {
    throw parseGraphQLError(error);
  }
}

/**
 * Client-side GraphQL caller
 * @deprecated Use gqlRequest instead for better type safety
 */
export const gqlGateway: GraphQLCaller = async <T>(
  query: RequestDocument,
  variables?: RequestVars,
): Promise<T> => {
  return gqlRequest<T>(query, variables);
};

export type GraphQLResult<T> =
  | { success: true; data: T }
  | { success: false; error: AppGraphQLError };

export async function gqlRequestSafe<
  TData,
  TVars extends Variables = Variables,
>(
  document: RequestDocument,
  variables?: TVars,
  options?: {
    token?: string;
    isServer?: boolean;
  },
): Promise<GraphQLResult<TData>> {
  try {
    const data = await gqlRequest<TData, TVars>(document, variables, options);
    return { success: true, data };
  } catch (error) {
    if (error instanceof AppGraphQLError) {
      return { success: false, error };
    }
    return { success: false, error: parseGraphQLError(error) };
  }
}

/**
 * Batch GraphQL requests - Paralel istekler için
 */
export async function gqlBatchRequest<T extends Record<string, unknown>>(
  requests: Array<{
    document: RequestDocument;
    variables?: Variables;
  }>,
  options?: {
    token?: string;
    isServer?: boolean;
  },
): Promise<GraphQLResult<T[]>> {
  try {
    const results = await Promise.all(
      requests.map((req) =>
        gqlRequest<unknown>(req.document, req.variables, options),
      ),
    );
    return { success: true, data: results as T[] };
  } catch (error) {
    if (error instanceof AppGraphQLError) {
      return { success: false, error };
    }
    return { success: false, error: parseGraphQLError(error) };
  }
}
