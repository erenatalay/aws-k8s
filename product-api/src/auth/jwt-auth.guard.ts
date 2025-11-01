import { firstValueFrom } from 'rxjs';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      this.logger.warn('No token found in request');
      throw new UnauthorizedException('Authentication token is required');
    }

    try {
      const result = await firstValueFrom(
        this.rabbitmqService.send('validate_token', { token }),
      );
      if (!result.valid) {
        this.logger.warn('Token validation failed:', result.error);
        throw new UnauthorizedException(result.error || 'Invalid token');
      }
      request.user = result.payload;

      return true;
    } catch (error) {
      this.logger.error('Token validation error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];
    
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      this.logger.warn('Invalid authorization header format');
      return null;
    }

    return parts[1];
  }
}
