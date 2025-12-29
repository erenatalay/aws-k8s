import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * JWT Authentication Guard
 * 
 * ✅ LOCAL token validation (JWT_SECRET ile)
 * ✅ ~1-5ms response time
 * ❌ Kafka round-trip YOK
 * 
 * Sektör standardı: Token self-contained, local validation
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  getRequest(context: ExecutionContext) {
    // GraphQL request kontrolü
    const ctx = GqlExecutionContext.create(context);
    const gqlRequest = ctx.getContext()?.req;

    if (gqlRequest) {
      return gqlRequest;
    }

    // HTTP request fallback
    return context.switchToHttp().getRequest();
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.warn(`Authentication failed: ${info?.message || 'Unknown error'}`);
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
