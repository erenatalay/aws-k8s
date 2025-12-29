import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

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
      this.logger.warn(
        `Authentication failed: ${info?.message || 'Unknown error'}`,
      );
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
