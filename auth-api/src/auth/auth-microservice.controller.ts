import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TokenService } from '../token/token.service';

@Controller()
export class AuthMicroserviceController {
  private readonly logger = new Logger(AuthMicroserviceController.name);

  constructor(private readonly tokenService: TokenService) {}

  // RabbitMQ Message Pattern: Token doğrulama
  @MessagePattern('validate_token')
  async validateToken(data: { token: string }) {
    this.logger.log('RabbitMQ: validate_token request received');
    
    try {
      const payload = await this.tokenService.verifyToken(data.token);
      
      return {
        valid: true,
        payload: {
          userId: payload.id,
          email: payload.email,
          role: payload.role || 'user',
        },
      };
    } catch (error) {
      this.logger.error('Token validation failed:', error.message);
      return {
        valid: false,
        error: 'Invalid or expired token',
      };
    }
  }
}
