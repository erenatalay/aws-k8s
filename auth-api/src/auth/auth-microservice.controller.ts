import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TokenService } from '../token/token.service';

@Controller()
export class AuthMicroserviceController {
  private readonly logger = new Logger(AuthMicroserviceController.name);

  constructor(private readonly tokenService: TokenService) {}

  // RabbitMQ Message Pattern: Token doğrulama
  @MessagePattern('validate_token')
  async validateToken(data: any) {
    this.logger.log('RabbitMQ: validate_token request received');
    this.logger.debug('Received data:', JSON.stringify(data));
    
    try {
      // Data'nın içinden token'ı al
      const token = data.token || data.data?.token || data;
      
      if (!token) {
        this.logger.error('No token found in request data');
        return {
          valid: false,
          error: 'No token provided',
        };
      }

      this.logger.debug(`Validating token: ${token.substring(0, 20)}...`);
      const payload = await this.tokenService.verifyToken(token);
      
      this.logger.log(`Token validated successfully for user: ${payload.email}`);
      
      return {
        valid: true,
        payload: {
          userId: payload.id,
          email: payload.email,
          firstname: payload.firstname,
          lastname: payload.lastname,
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
