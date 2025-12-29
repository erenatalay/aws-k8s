/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  mutation Register($input: RegisterInput!) {\n    register(registerInput: $input) {\n      id\n      firstname\n      lastname\n      email\n      accessToken\n      refreshToken\n    }\n  }\n': typeof types.RegisterDocument;
  '\n  mutation Login($input: LoginInput!) {\n    login(loginInput: $input) {\n      id\n      firstname\n      lastname\n      email\n      accessToken\n      refreshToken\n    }\n  }\n': typeof types.LoginDocument;
  '\n  mutation VerifyAccount($input: VerifyAccountInput!) {\n    verifyAccount(verifyAccountInput: $input) {\n      message\n    }\n  }\n': typeof types.VerifyAccountDocument;
  '\n  mutation ForgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(forgotPasswordInput: $input) {\n      message\n    }\n  }\n': typeof types.ForgotPasswordDocument;
  '\n  mutation ResetPassword($input: ResetPasswordInput!) {\n    resetPassword(resetPasswordInput: $input) {\n      message\n    }\n  }\n': typeof types.ResetPasswordDocument;
  '\n  query GetUser($uuid: String!) {\n    user(uuid: $uuid) {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n': typeof types.GetUserDocument;
  '\n  query GetMe {\n    me {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n': typeof types.GetMeDocument;
  '\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n': typeof types.UpdateUserDocument;
  '\n  mutation ChangePassword($input: ChangePasswordInput!) {\n    changeUserPassword(input: $input) {\n      id\n      firstname\n      lastname\n      email\n    }\n  }\n': typeof types.ChangePasswordDocument;
  '\n  mutation DeleteUser {\n    deleteUser {\n      message\n    }\n  }\n': typeof types.DeleteUserDocument;
  '\n  query GetProducts($query: QueryProductInput) {\n    products(query: $query) {\n      data {\n        id\n        name\n        description\n        price\n        userId\n        createdAt\n        updatedAt\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n': typeof types.GetProductsDocument;
  '\n  query GetProduct($id: String!) {\n    product(id: $id) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n': typeof types.GetProductDocument;
  '\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(createProductInput: $input) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n': typeof types.CreateProductDocument;
  '\n  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, updateProductInput: $input) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n': typeof types.UpdateProductDocument;
  '\n  mutation DeleteProduct($id: String!) {\n    removeProduct(id: $id) {\n      message\n    }\n  }\n': typeof types.DeleteProductDocument;
};
const documents: Documents = {
  '\n  mutation Register($input: RegisterInput!) {\n    register(registerInput: $input) {\n      id\n      firstname\n      lastname\n      email\n      accessToken\n      refreshToken\n    }\n  }\n':
    types.RegisterDocument,
  '\n  mutation Login($input: LoginInput!) {\n    login(loginInput: $input) {\n      id\n      firstname\n      lastname\n      email\n      accessToken\n      refreshToken\n    }\n  }\n':
    types.LoginDocument,
  '\n  mutation VerifyAccount($input: VerifyAccountInput!) {\n    verifyAccount(verifyAccountInput: $input) {\n      message\n    }\n  }\n':
    types.VerifyAccountDocument,
  '\n  mutation ForgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(forgotPasswordInput: $input) {\n      message\n    }\n  }\n':
    types.ForgotPasswordDocument,
  '\n  mutation ResetPassword($input: ResetPasswordInput!) {\n    resetPassword(resetPasswordInput: $input) {\n      message\n    }\n  }\n':
    types.ResetPasswordDocument,
  '\n  query GetUser($uuid: String!) {\n    user(uuid: $uuid) {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n':
    types.GetUserDocument,
  '\n  query GetMe {\n    me {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n':
    types.GetMeDocument,
  '\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n':
    types.UpdateUserDocument,
  '\n  mutation ChangePassword($input: ChangePasswordInput!) {\n    changeUserPassword(input: $input) {\n      id\n      firstname\n      lastname\n      email\n    }\n  }\n':
    types.ChangePasswordDocument,
  '\n  mutation DeleteUser {\n    deleteUser {\n      message\n    }\n  }\n':
    types.DeleteUserDocument,
  '\n  query GetProducts($query: QueryProductInput) {\n    products(query: $query) {\n      data {\n        id\n        name\n        description\n        price\n        userId\n        createdAt\n        updatedAt\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n':
    types.GetProductsDocument,
  '\n  query GetProduct($id: String!) {\n    product(id: $id) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n':
    types.GetProductDocument,
  '\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(createProductInput: $input) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n':
    types.CreateProductDocument,
  '\n  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, updateProductInput: $input) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n':
    types.UpdateProductDocument,
  '\n  mutation DeleteProduct($id: String!) {\n    removeProduct(id: $id) {\n      message\n    }\n  }\n':
    types.DeleteProductDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Register($input: RegisterInput!) {\n    register(registerInput: $input) {\n      id\n      firstname\n      lastname\n      email\n      accessToken\n      refreshToken\n    }\n  }\n',
): (typeof documents)['\n  mutation Register($input: RegisterInput!) {\n    register(registerInput: $input) {\n      id\n      firstname\n      lastname\n      email\n      accessToken\n      refreshToken\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Login($input: LoginInput!) {\n    login(loginInput: $input) {\n      id\n      firstname\n      lastname\n      email\n      accessToken\n      refreshToken\n    }\n  }\n',
): (typeof documents)['\n  mutation Login($input: LoginInput!) {\n    login(loginInput: $input) {\n      id\n      firstname\n      lastname\n      email\n      accessToken\n      refreshToken\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation VerifyAccount($input: VerifyAccountInput!) {\n    verifyAccount(verifyAccountInput: $input) {\n      message\n    }\n  }\n',
): (typeof documents)['\n  mutation VerifyAccount($input: VerifyAccountInput!) {\n    verifyAccount(verifyAccountInput: $input) {\n      message\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ForgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(forgotPasswordInput: $input) {\n      message\n    }\n  }\n',
): (typeof documents)['\n  mutation ForgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(forgotPasswordInput: $input) {\n      message\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ResetPassword($input: ResetPasswordInput!) {\n    resetPassword(resetPasswordInput: $input) {\n      message\n    }\n  }\n',
): (typeof documents)['\n  mutation ResetPassword($input: ResetPasswordInput!) {\n    resetPassword(resetPasswordInput: $input) {\n      message\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetUser($uuid: String!) {\n    user(uuid: $uuid) {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n',
): (typeof documents)['\n  query GetUser($uuid: String!) {\n    user(uuid: $uuid) {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetMe {\n    me {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n',
): (typeof documents)['\n  query GetMe {\n    me {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      firstname\n      lastname\n      email\n      avatar\n      birthday\n      phone\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ChangePassword($input: ChangePasswordInput!) {\n    changeUserPassword(input: $input) {\n      id\n      firstname\n      lastname\n      email\n    }\n  }\n',
): (typeof documents)['\n  mutation ChangePassword($input: ChangePasswordInput!) {\n    changeUserPassword(input: $input) {\n      id\n      firstname\n      lastname\n      email\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteUser {\n    deleteUser {\n      message\n    }\n  }\n',
): (typeof documents)['\n  mutation DeleteUser {\n    deleteUser {\n      message\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetProducts($query: QueryProductInput) {\n    products(query: $query) {\n      data {\n        id\n        name\n        description\n        price\n        userId\n        createdAt\n        updatedAt\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n',
): (typeof documents)['\n  query GetProducts($query: QueryProductInput) {\n    products(query: $query) {\n      data {\n        id\n        name\n        description\n        price\n        userId\n        createdAt\n        updatedAt\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetProduct($id: String!) {\n    product(id: $id) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n',
): (typeof documents)['\n  query GetProduct($id: String!) {\n    product(id: $id) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(createProductInput: $input) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(createProductInput: $input) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, updateProductInput: $input) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, updateProductInput: $input) {\n      id\n      name\n      description\n      price\n      userId\n      createdAt\n      updatedAt\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteProduct($id: String!) {\n    removeProduct(id: $id) {\n      message\n    }\n  }\n',
): (typeof documents)['\n  mutation DeleteProduct($id: String!) {\n    removeProduct(id: $id) {\n      message\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
