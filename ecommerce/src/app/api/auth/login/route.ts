import { NextRequest } from 'next/server';
import { buildAccessCookie, buildRefreshCookie } from '@/lib/auth/cookies';

const AUTH_URL =
  process.env.AUTH_GRAPHQL_URL ?? 'http://localhost:3001/graphql';

const LOGIN_MUTATION = /* GraphQL */ `
  mutation ApiLogin($input: LoginInput!) {
    login(loginInput: $input) {
      id
      firstname
      lastname
      email
      avatar
      birthday
      phone
      accessToken
      refreshToken
    }
  }
`;

async function callAuth<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Auth service responded ${res.status}`);
  }
  const json = await res.json();
  if (json.errors) {
    const message = json.errors[0]?.message ?? 'Auth error';
    throw new Error(message);
  }
  return json.data as T;
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Missing email or password' }),
      { status: 400 },
    );
  }

  try {
    const data = await callAuth<{ login: any }>(LOGIN_MUTATION, {
      input: { email, password },
    });
    const result = data.login;

    const headers = new Headers();
    headers.append('Set-Cookie', buildAccessCookie(result.accessToken));
    headers.append('Set-Cookie', buildRefreshCookie(result.refreshToken));

    const {
      accessToken: _accessToken,
      refreshToken: _refreshToken,
      ...user
    } = result;
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Login failed',
      }),
      {
        status: 401,
      },
    );
  }
}
