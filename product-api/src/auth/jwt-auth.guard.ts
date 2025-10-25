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
      this.logger.log('Validating token via RabbitMQ...');

      // Auth API'ye RabbitMQ üzerinden token doğrulama isteği gönder
      const result = await firstValueFrom(
        this.rabbitmqService.send('validate_token', { token }),
      );

      if (!result.valid) {
        this.logger.warn('Token validation failed:', result.error);
        throw new UnauthorizedException(result.error || 'Invalid token');
      }

      // Token geçerliyse, user bilgisini request'e ekle
      request.user = result.payload;
      this.logger.log(`Token validated successfully for user: ${result.payload.email}`);

      return true;
    } catch (error) {
      this.logger.error('Token validation error:', error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Token validation failed');
    }
  }

  /**
   * Authorization header'dan Bearer token'ı çıkarır
   * Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
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
