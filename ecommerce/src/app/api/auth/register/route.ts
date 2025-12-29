import { NextRequest } from 'next/server';

import { buildAccessCookie, buildRefreshCookie } from '@/lib/auth/cookies';

const AUTH_URL =
  process.env.AUTH_GRAPHQL_URL ?? 'http://localhost:3001/graphql';

const REGISTER_MUTATION = /* GraphQL */ `
  mutation ApiRegister($input: RegisterInput!) {
    register(registerInput: $input) {
      id
      firstname
      lastname
      email
      avatar
      birthday
      phone
    }
  }
`;

const LOGIN_MUTATION = /* GraphQL */ `
  mutation ApiLoginAfterRegister($input: LoginInput!) {
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
  const { firstname, lastname, email, password } = body as {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
  };

  if (!firstname || !lastname || !email || !password) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
    });
  }

  try {
    // First create the user
    const registerData = await callAuth<{ register: any }>(REGISTER_MUTATION, {
      input: { firstname, lastname, email, password },
    });
    const registered = registerData.register;

    // Then log in to obtain tokens (some backends do not return tokens on register)
    const loginData = await callAuth<{ login: any }>(LOGIN_MUTATION, {
      input: { email, password },
    });
    const result = loginData.login;

    const headers = new Headers();
    headers.append('Set-Cookie', buildAccessCookie(result.accessToken));
    headers.append('Set-Cookie', buildRefreshCookie(result.refreshToken));

    const {
      accessToken: _accessToken,
      refreshToken: _refreshToken,
      ...user
    } = result;
    return new Response(JSON.stringify({ user, registered }), {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Register failed',
      }),
      {
        status: 400,
      },
    );
  }
}
