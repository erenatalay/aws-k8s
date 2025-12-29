/**
 * GraphQL Error Codes - Backend ile senkronize tutulmalı
 */
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

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export interface GraphQLErrorExtensions {
  code: ErrorCode;
  statusCode: number;
  timestamp: string;
  path?: string;
  field?: string;
  details?: Record<string, unknown>;
}

/**
 * Yapılandırılmış GraphQL hatası
 */
export class AppGraphQLError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly field?: string;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    options?: {
      field?: string;
      details?: Record<string, unknown>;
      timestamp?: string;
    },
  ) {
    super(message);
    this.name = 'AppGraphQLError';
    this.code = code;
    this.statusCode = statusCode;
    this.field = options?.field;
    this.details = options?.details;
    this.timestamp = options?.timestamp || new Date().toISOString();
  }

  /**
   * Hatanın authentication ile ilgili olup olmadığını kontrol eder
   */
  isAuthError(): boolean {
    return [
      ErrorCode.UNAUTHENTICATED,
      ErrorCode.UNAUTHORIZED,
      ErrorCode.FORBIDDEN,
      ErrorCode.INVALID_CREDENTIALS,
    ].includes(this.code);
  }

  /**
   * Hatanın validation ile ilgili olup olmadığını kontrol eder
   */
  isValidationError(): boolean {
    return [ErrorCode.VALIDATION_ERROR, ErrorCode.BAD_REQUEST].includes(
      this.code,
    );
  }

  /**
   * Hatanın sunucu hatası olup olmadığını kontrol eder
   */
  isServerError(): boolean {
    return [
      ErrorCode.INTERNAL_SERVER_ERROR,
      ErrorCode.SERVICE_UNAVAILABLE,
    ].includes(this.code);
  }

  /**
   * Kullanıcıya gösterilebilir hata mesajı
   */
  getUserFriendlyMessage(): string {
    const messages: Record<ErrorCode, string> = {
      [ErrorCode.UNAUTHENTICATED]: 'Lütfen giriş yapın',
      [ErrorCode.UNAUTHORIZED]: 'Bu işlemi yapmaya yetkiniz yok',
      [ErrorCode.FORBIDDEN]: 'Erişim engellendi',
      [ErrorCode.INVALID_CREDENTIALS]: 'Email veya şifre hatalı',
      [ErrorCode.USER_NOT_FOUND]: 'Kullanıcı bulunamadı',
      [ErrorCode.USER_ALREADY_EXISTS]: 'Bu email adresi zaten kayıtlı',
      [ErrorCode.ACCOUNT_NOT_ACTIVATED]: 'Hesabınız henüz aktif edilmemiş',
      [ErrorCode.ACCOUNT_DELETED]: 'Bu hesap silinmiş',
      [ErrorCode.INVALID_ACTIVATION_CODE]: 'Geçersiz aktivasyon kodu',
      [ErrorCode.INVALID_RESET_CODE]: 'Geçersiz şifre sıfırlama kodu',
      [ErrorCode.RESET_CODE_EXPIRED]: 'Şifre sıfırlama kodunun süresi dolmuş',
      [ErrorCode.PRODUCT_NOT_FOUND]: 'Ürün bulunamadı',
      [ErrorCode.PRODUCT_ALREADY_EXISTS]: 'Bu ürün zaten mevcut',
      [ErrorCode.INVALID_PRICE]: 'Geçersiz fiyat değeri',
      [ErrorCode.VALIDATION_ERROR]: 'Girilen bilgiler geçersiz',
      [ErrorCode.BAD_REQUEST]: 'Hatalı istek',
      [ErrorCode.NOT_FOUND]: 'Kayıt bulunamadı',
      [ErrorCode.CONFLICT]: 'Çakışma hatası',
      [ErrorCode.INTERNAL_SERVER_ERROR]: 'Sunucu hatası oluştu',
      [ErrorCode.SERVICE_UNAVAILABLE]: 'Servis geçici olarak kullanılamıyor',
      [ErrorCode.NETWORK_ERROR]: 'Bağlantı hatası',
    };

    return messages[this.code] || this.message;
  }
}

/**
 * GraphQL hatasını AppGraphQLError'a dönüştürür
 */
export function parseGraphQLError(error: unknown): AppGraphQLError {
  // ClientError (graphql-request)
  if (error && typeof error === 'object' && 'response' in error) {
    const clientError = error as {
      response?: {
        errors?: Array<{
          message?: string;
          extensions?: GraphQLErrorExtensions;
        }>;
        status?: number;
      };
    };

    const firstError = clientError.response?.errors?.[0];
    if (firstError) {
      const extensions = firstError.extensions;
      return new AppGraphQLError(
        firstError.message || 'An error occurred',
        (extensions?.code as ErrorCode) || ErrorCode.INTERNAL_SERVER_ERROR,
        extensions?.statusCode || clientError.response?.status || 500,
        {
          field: extensions?.field,
          details: extensions?.details,
          timestamp: extensions?.timestamp,
        },
      );
    }
  }

  // Standart Error
  if (error instanceof Error) {
    // Network error kontrolü
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new AppGraphQLError(
        'Network connection failed',
        ErrorCode.NETWORK_ERROR,
        0,
      );
    }

    return new AppGraphQLError(
      error.message,
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
    );
  }

  // Bilinmeyen hata
  return new AppGraphQLError(
    'An unexpected error occurred',
    ErrorCode.INTERNAL_SERVER_ERROR,
    500,
  );
}
