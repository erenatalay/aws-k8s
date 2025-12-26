import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ErrorCode } from './graphql-error.filter';

export interface CreateGraphQLErrorOptions {
  code: ErrorCode;
  statusCode?: number;
  field?: string;
  details?: Record<string, unknown>;
}

/**
 * GraphQL Error Factory - Tutarlı hata formatı için kullanılır
 */
export function createGraphQLError(
  message: string,
  options: CreateGraphQLErrorOptions,
): GraphQLError {
  const statusCode = options.statusCode ?? HttpStatus.BAD_REQUEST;

  return new GraphQLError(message, {
    extensions: {
      code: options.code,
      statusCode,
      timestamp: new Date().toISOString(),
      field: options.field,
      details: options.details,
    },
  });
}

/**
 * Önceden tanımlı hata oluşturucular
 */
export const GraphQLErrors = {
  // Auth errors
  unauthenticated: (message = 'Authentication required') =>
    createGraphQLError(message, {
      code: ErrorCode.UNAUTHENTICATED,
      statusCode: HttpStatus.UNAUTHORIZED,
    }),

  unauthorized: (message = 'You are not authorized to perform this action') =>
    createGraphQLError(message, {
      code: ErrorCode.UNAUTHORIZED,
      statusCode: HttpStatus.UNAUTHORIZED,
    }),

  forbidden: (message = 'Access denied') =>
    createGraphQLError(message, {
      code: ErrorCode.FORBIDDEN,
      statusCode: HttpStatus.FORBIDDEN,
    }),

  invalidCredentials: (message = 'Invalid email or password') =>
    createGraphQLError(message, {
      code: ErrorCode.INVALID_CREDENTIALS,
      statusCode: HttpStatus.UNAUTHORIZED,
    }),

  userNotFound: (message = 'User not found') =>
    createGraphQLError(message, {
      code: ErrorCode.USER_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    }),

  userAlreadyExists: (message = 'User already exists') =>
    createGraphQLError(message, {
      code: ErrorCode.USER_ALREADY_EXISTS,
      statusCode: HttpStatus.CONFLICT,
    }),

  accountNotActivated: (message = 'Account not activated') =>
    createGraphQLError(message, {
      code: ErrorCode.ACCOUNT_NOT_ACTIVATED,
      statusCode: HttpStatus.FORBIDDEN,
    }),

  invalidActivationCode: (message = 'Invalid activation code') =>
    createGraphQLError(message, {
      code: ErrorCode.INVALID_ACTIVATION_CODE,
      statusCode: HttpStatus.BAD_REQUEST,
    }),

  invalidResetCode: (message = 'Invalid reset code') =>
    createGraphQLError(message, {
      code: ErrorCode.INVALID_RESET_CODE,
      statusCode: HttpStatus.BAD_REQUEST,
    }),

  resetCodeExpired: (message = 'Reset code has expired') =>
    createGraphQLError(message, {
      code: ErrorCode.RESET_CODE_EXPIRED,
      statusCode: HttpStatus.BAD_REQUEST,
    }),

  // Validation errors
  validationError: (message: string, field?: string, details?: Record<string, unknown>) =>
    createGraphQLError(message, {
      code: ErrorCode.VALIDATION_ERROR,
      statusCode: HttpStatus.BAD_REQUEST,
      field,
      details,
    }),

  badRequest: (message: string, details?: Record<string, unknown>) =>
    createGraphQLError(message, {
      code: ErrorCode.BAD_REQUEST,
      statusCode: HttpStatus.BAD_REQUEST,
      details,
    }),

  // Resource errors
  notFound: (resource: string, id?: string) =>
    createGraphQLError(`${resource} not found${id ? `: ${id}` : ''}`, {
      code: ErrorCode.NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    }),

  conflict: (message: string) =>
    createGraphQLError(message, {
      code: ErrorCode.CONFLICT,
      statusCode: HttpStatus.CONFLICT,
    }),

  // Server errors
  internal: (message = 'Internal server error') =>
    createGraphQLError(message, {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }),

  serviceUnavailable: (message = 'Service temporarily unavailable') =>
    createGraphQLError(message, {
      code: ErrorCode.SERVICE_UNAVAILABLE,
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    }),
};

