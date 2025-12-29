import { gql } from '@apollo/client';

// ============================================
// Auth Mutations
// ============================================

export const REGISTER_USER = gql`
  mutation Register($input: RegisterInput!) {
    register(registerInput: $input) {
      id
      firstname
      lastname
      email
      accessToken
      refreshToken
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(loginInput: $input) {
      id
      firstname
      lastname
      email
      accessToken
      refreshToken
    }
  }
`;

export const VERIFY_ACCOUNT = gql`
  mutation VerifyAccount($input: VerifyAccountInput!) {
    verifyAccount(verifyAccountInput: $input) {
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(forgotPasswordInput: $input) {
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(resetPasswordInput: $input) {
      message
    }
  }
`;

// ============================================
// User Queries & Mutations
// ============================================

export const GET_USER = gql`
  query GetUser($uuid: String!) {
    user(uuid: $uuid) {
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

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
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

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changeUserPassword(input: $input) {
      id
      firstname
      lastname
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($uuid: String!) {
    deleteUser(uuid: $uuid) {
      message
    }
  }
`;
