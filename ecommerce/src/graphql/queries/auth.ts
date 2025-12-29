import { graphql } from '../../gql';

// ============================================
// Auth Mutations
// ============================================

export const REGISTER_USER = graphql(`
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
`);

export const LOGIN_USER = graphql(`
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
`);

export const VERIFY_ACCOUNT = graphql(`
  mutation VerifyAccount($input: VerifyAccountInput!) {
    verifyAccount(verifyAccountInput: $input) {
      message
    }
  }
`);

export const FORGOT_PASSWORD = graphql(`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(forgotPasswordInput: $input) {
      message
    }
  }
`);

export const RESET_PASSWORD = graphql(`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(resetPasswordInput: $input) {
      message
    }
  }
`);

// ============================================
// User Queries & Mutations
// ============================================

export const GET_USER = graphql(`
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
`);

export const UPDATE_USER = graphql(`
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
`);

export const CHANGE_PASSWORD = graphql(`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changeUserPassword(input: $input) {
      id
      firstname
      lastname
      email
    }
  }
`);

export const DELETE_USER = graphql(`
  mutation DeleteUser($uuid: String!) {
    deleteUser(uuid: $uuid) {
      message
    }
  }
`);
