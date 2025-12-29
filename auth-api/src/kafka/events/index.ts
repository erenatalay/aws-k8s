/**
 * Kafka Event Definitions
 *
 * Event Versioning - Sektör Standardı
 * Her event'in versiyonu var, breaking change'lerde version artırılır
 */

// ============================================
// Event Base Types
// ============================================

export interface BaseEvent<T = any> {
  version: string;
  timestamp: Date;
  source: string;
  traceId: string;
  data: T;
}

// ============================================
// User Events (v1)
// ============================================

export const USER_EVENTS = {
  REGISTERED: 'user.registered.v1',
  LOGIN: 'user.login.v1',
  LOGOUT: 'user.logout.v1',
  PASSWORD_CHANGED: 'user.password_changed.v1',
  PASSWORD_RESET_REQUESTED: 'user.password_reset_requested.v1',
  EMAIL_VERIFIED: 'user.email_verified.v1',
  PROFILE_UPDATED: 'user.profile_updated.v1',
  DELETED: 'user.deleted.v1',
} as const;

export type UserEventType = (typeof USER_EVENTS)[keyof typeof USER_EVENTS];

// User Registered Event
export interface UserRegisteredEventData {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  registeredAt: Date;
}

export type UserRegisteredEvent = BaseEvent<UserRegisteredEventData>;

// User Login Event
export interface UserLoginEventData {
  userId: string;
  email: string;
  loginTime: Date;
  ipAddress?: string;
  userAgent?: string;
}

export type UserLoginEvent = BaseEvent<UserLoginEventData>;

// User Password Changed Event
export interface UserPasswordChangedEventData {
  userId: string;
  changedAt: Date;
}

export type UserPasswordChangedEvent = BaseEvent<UserPasswordChangedEventData>;

// ============================================
// Helper Functions
// ============================================

export function createEvent<T>(
  data: T,
  source: string = 'auth-service',
): BaseEvent<T> {
  return {
    version: '1.0.0',
    timestamp: new Date(),
    source,
    traceId: generateTraceId(),
    data,
  };
}

function generateTraceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
