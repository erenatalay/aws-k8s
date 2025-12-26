import { GraphQLError } from 'graphql';
import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

export enum ErrorCode {
  // Auth errors
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  ACCOUNT_NOT_ACTIVATED = 'ACCOUNT_NOT_ACTIVATED',
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',
  INVALID_ACTIVATION_CODE = 'INVALID_ACTIVATION_CODE',
  INVALID_RESET_CODE = 'INVALID_RESET_CODE',
  RESET_CODE_EXPIRED = 'RESET_CODE_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  
  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface GraphQLErrorExtensions {
  code: ErrorCode;
  statusCode: number;
  timestamp: string;
  path?: string;
  field?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

@Catch()
export class GraphQLErrorFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();
    const info = gqlHost.getInfo();
    
    const { message, code, statusCode, details } = this.extractErrorInfo(exception);
    
    const extensions: GraphQLErrorExtensions = {
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      path: info?.fieldName,
      details,
    };

    return new GraphQLError(message, {
      extensions,
    });
  }

  private extractErrorInfo(exception: unknown): {
    message: string;
    code: ErrorCode;
    statusCode: number;
    details?: Record<string, unknown>;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message = typeof response === 'object' && 'message' in response
        ? (response as any).message
        : exception.message;

      return {
        message: Array.isArray(message) ? message.join(', ') : message,
        code: this.httpStatusToErrorCode(status, message),
        statusCode: status,
        details: typeof response === 'object' ? response as Record<string, unknown> : undefined,
      };
    }

    if (exception instanceof GraphQLError) {
      return {
        message: exception.message,
        code: (exception.extensions?.code as ErrorCode) || ErrorCode.INTERNAL_SERVER_ERROR,
        statusCode: (exception.extensions?.statusCode as number) || HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (exception instanceof Error) {
      return {
        message: exception.message,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  private httpStatusToErrorCode(status: number, message?: string): ErrorCode {
    // Mesaja göre daha spesifik kod belirle
    if (message) {
      const lowerMessage = typeof message === 'string' ? message.toLowerCase() : '';
      if (lowerMessage.includes('already exist')) return ErrorCode.USER_ALREADY_EXISTS;
      if (lowerMessage.includes('not found')) return ErrorCode.USER_NOT_FOUND;
      if (lowerMessage.includes('not activated')) return ErrorCode.ACCOUNT_NOT_ACTIVATED;
      if (lowerMessage.includes('deleted')) return ErrorCode.ACCOUNT_DELETED;
      if (lowerMessage.includes('activation code')) return ErrorCode.INVALID_ACTIVATION_CODE;
      if (lowerMessage.includes('reset code')) return ErrorCode.INVALID_RESET_CODE;
      if (lowerMessage.includes('expired')) return ErrorCode.RESET_CODE_EXPIRED;
      if (lowerMessage.includes('password')) return ErrorCode.INVALID_CREDENTIALS;
    }

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHENTICATED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ErrorCode.VALIDATION_ERROR;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return ErrorCode.SERVICE_UNAVAILABLE;
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}

