/* eslint-disable */
/**
 * Bu dosya GraphQL Codegen tarafından otomatik oluşturulur.
 * Manuel değişiklik yapmayın.
 * 
 * Yeniden oluşturmak için: yarn codegen
 */

export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: string; output: string };
};

// ============================================
// Types
// ============================================

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  firstname: Scalars['String']['output'];
  lastname: Scalars['String']['output'];
  email: Scalars['String']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  birthday?: Maybe<Scalars['DateTime']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  id: Scalars['ID']['output'];
  firstname: Scalars['String']['output'];
  lastname: Scalars['String']['output'];
  email: Scalars['String']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  birthday?: Maybe<Scalars['DateTime']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  message: Scalars['String']['output'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  userId: Scalars['String']['output'];
  owner?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductsResponse = {
  __typename?: 'ProductsResponse';
  data: Array<Product>;
  total: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  limit: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

// ============================================
// Input Types
// ============================================

export type RegisterInput = {
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type VerifyAccountInput = {
  email: Scalars['String']['input'];
  activationCode: Scalars['String']['input'];
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
  resetCode: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ChangePasswordInput = {
  uuid: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type UpdateUserInput = {
  uuid: Scalars['String']['input'];
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  birthday?: InputMaybe<Scalars['DateTime']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  avatar?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProductInput = {
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
};

export type UpdateProductInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryProductInput = {
  search?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

// ============================================
// Query & Mutation Types
// ============================================

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String']['output'];
  helloProduct: Scalars['String']['output'];
  user: User;
  product: Product;
  products: ProductsResponse;
};

export type QueryUserArgs = {
  uuid: Scalars['String']['input'];
};

export type QueryProductArgs = {
  id: Scalars['String']['input'];
};

export type QueryProductsArgs = {
  query?: InputMaybe<QueryProductInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  register: AuthResponse;
  login: AuthResponse;
  verifyAccount: MessageResponse;
  forgotPassword: MessageResponse;
  resetPassword: MessageResponse;
  changeUserPassword: User;
  updateUser: User;
  deleteUser: MessageResponse;
  createProduct: Product;
  updateProduct: Product;
  removeProduct: MessageResponse;
};

export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};

export type MutationLoginArgs = {
  loginInput: LoginInput;
};

export type MutationVerifyAccountArgs = {
  verifyAccountInput: VerifyAccountInput;
};

export type MutationForgotPasswordArgs = {
  forgotPasswordInput: ForgotPasswordInput;
};

export type MutationResetPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};

export type MutationChangeUserPasswordArgs = {
  input: ChangePasswordInput;
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type MutationDeleteUserArgs = {
  uuid: Scalars['String']['input'];
};

export type MutationCreateProductArgs = {
  createProductInput: CreateProductInput;
};

export type MutationUpdateProductArgs = {
  id: Scalars['String']['input'];
  updateProductInput: UpdateProductInput;
};

export type MutationRemoveProductArgs = {
  id: Scalars['String']['input'];
};

