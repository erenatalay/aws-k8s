import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TokenService } from '../token/token.service';

@Controller()
export class AuthMicroserviceController {
  private readonly logger = new Logger(AuthMicroserviceController.name);

  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern('validate_token')
  async validateToken(data: any) {
    try {
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
