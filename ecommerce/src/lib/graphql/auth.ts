import { gql } from 'graphql-request';
import { gqlRequest, gqlRequestSafe, GraphQLResult } from './clients';
import type {
  AuthResponse,
  User,
  MessageResponse,
  RegisterInput,
  LoginInput,
  VerifyAccountInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateUserInput,
} from '@/graphql/generated';

// ============================================
// Fragments
// ============================================

const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    firstname
    lastname
    email
    avatar
    birthday
    phone
  }
`;

const AUTH_RESPONSE_FRAGMENT = gql`
  fragment AuthResponseFields on AuthResponse {
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
`;

// ============================================
// Mutations
// ============================================

const REGISTER_MUTATION = gql`
  ${AUTH_RESPONSE_FRAGMENT}
  mutation Register($input: RegisterInput!) {
    register(registerInput: $input) {
      ...AuthResponseFields
    }
  }
`;

const LOGIN_MUTATION = gql`
  ${AUTH_RESPONSE_FRAGMENT}
  mutation Login($input: LoginInput!) {
    login(loginInput: $input) {
      ...AuthResponseFields
    }
  }
`;

const VERIFY_ACCOUNT_MUTATION = gql`
  mutation VerifyAccount($input: VerifyAccountInput!) {
    verifyAccount(verifyAccountInput: $input) {
      message
    }
  }
`;

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(forgotPasswordInput: $input) {
      message
    }
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(resetPasswordInput: $input) {
      message
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation ChangePassword($input: ChangePasswordInput!) {
    changeUserPassword(input: $input) {
      ...UserFields
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  ${USER_FRAGMENT}
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...UserFields
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($uuid: String!) {
    deleteUser(uuid: $uuid) {
      message
    }
  }
`;

// ============================================
// Queries
// ============================================

const GET_USER_QUERY = gql`
  ${USER_FRAGMENT}
  query GetUser($uuid: String!) {
    user(uuid: $uuid) {
      ...UserFields
    }
  }
`;

// ============================================
// API Functions - Type Safe
// ============================================

/**
 * Kullanıcı kaydı
 */
export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { register: result } = await gqlRequest<{ register: AuthResponse }>(
    REGISTER_MUTATION,
    { input },
  );
  return result;
}

/**
 * Kullanıcı kaydı - Safe version
 */
export async function registerSafe(
  input: RegisterInput,
): Promise<GraphQLResult<AuthResponse>> {
  const result = await gqlRequestSafe<{ register: AuthResponse }>(
    REGISTER_MUTATION,
    { input },
  );
  if (result.success) {
    return { success: true, data: result.data.register };
  }
  return result;
}

/**
 * Kullanıcı girişi
 */
export async function login(input: LoginInput): Promise<AuthResponse> {
  const { login: result } = await gqlRequest<{ login: AuthResponse }>(
    LOGIN_MUTATION,
    { input },
  );
  return result;
}

/**
 * Kullanıcı girişi - Safe version
 */
export async function loginSafe(
  input: LoginInput,
): Promise<GraphQLResult<AuthResponse>> {
  const result = await gqlRequestSafe<{ login: AuthResponse }>(LOGIN_MUTATION, {
    input,
  });
  if (result.success) {
    return { success: true, data: result.data.login };
  }
  return result;
}

/**
 * Hesap doğrulama
 */
export async function verifyAccount(
  input: VerifyAccountInput,
): Promise<MessageResponse> {
  const { verifyAccount: result } = await gqlRequest<{
    verifyAccount: MessageResponse;
  }>(VERIFY_ACCOUNT_MUTATION, { input });
  return result;
}

/**
 * Şifremi unuttum
 */
export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<MessageResponse> {
  const { forgotPassword: result } = await gqlRequest<{
    forgotPassword: MessageResponse;
  }>(FORGOT_PASSWORD_MUTATION, { input });
  return result;
}

/**
 * Şifre sıfırlama
 */
export async function resetPassword(
  input: ResetPasswordInput,
): Promise<MessageResponse> {
  const { resetPassword: result } = await gqlRequest<{
    resetPassword: MessageResponse;
  }>(RESET_PASSWORD_MUTATION, { input });
  return result;
}

/**
 * Şifre değiştirme
 */
export async function changePassword(
  input: ChangePasswordInput,
): Promise<User> {
  const { changeUserPassword: result } = await gqlRequest<{
    changeUserPassword: User;
  }>(CHANGE_PASSWORD_MUTATION, { input });
  return result;
}

/**
 * Kullanıcı güncelleme
 */
export async function updateUser(input: UpdateUserInput): Promise<User> {
  const { updateUser: result } = await gqlRequest<{ updateUser: User }>(
    UPDATE_USER_MUTATION,
    { input },
  );
  return result;
}

/**
 * Kullanıcı silme
 */
export async function deleteUser(uuid: string): Promise<MessageResponse> {
  const { deleteUser: result } = await gqlRequest<{
    deleteUser: MessageResponse;
  }>(DELETE_USER_MUTATION, { uuid });
  return result;
}

/**
 * Kullanıcı bilgisi getir
 */
export async function getUser(uuid: string): Promise<User> {
  const { user } = await gqlRequest<{ user: User }>(GET_USER_QUERY, { uuid });
  return user;
}

/**
 * Kullanıcı bilgisi getir - Safe version
 */
export async function getUserSafe(uuid: string): Promise<GraphQLResult<User>> {
  const result = await gqlRequestSafe<{ user: User }>(GET_USER_QUERY, { uuid });
  if (result.success) {
    return { success: true, data: result.data.user };
  }
  return result;
}

// ============================================
// Server-side API Functions
// ============================================

/**
 * Server-side kullanıcı bilgisi getir
 */
export async function getUserServer(
  uuid: string,
  token?: string,
): Promise<User> {
  const { user } = await gqlRequest<{ user: User }>(
    GET_USER_QUERY,
    { uuid },
    { token, isServer: true },
  );
  return user;
}
