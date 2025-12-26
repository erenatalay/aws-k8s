import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

export enum ErrorCode {
  // Auth errors
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Product errors
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_ALREADY_EXISTS = 'PRODUCT_ALREADY_EXISTS',
  INVALID_PRICE = 'INVALID_PRICE',
  
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
      if (lowerMessage.includes('product') && lowerMessage.includes('not found')) {
        return ErrorCode.PRODUCT_NOT_FOUND;
      }
      if (lowerMessage.includes('product') && lowerMessage.includes('already')) {
        return ErrorCode.PRODUCT_ALREADY_EXISTS;
      }
      if (lowerMessage.includes('price')) return ErrorCode.INVALID_PRICE;
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

