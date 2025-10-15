import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MessageEvent } from '../rabbitmq/rabbitmq.service';

@Controller()
export class AuthConsumerController {
  private readonly logger = new Logger(AuthConsumerController.name);

  @EventPattern('user.registered')
  async handleUserRegistered(@Payload() data: MessageEvent) {
    this.logger.log('Received user.registered event', data);
    
    // Handle user registration event
    try {
      // Process user registration
      // Send welcome email, create user profile, etc.
      
      this.logger.log(`User registration processed for user: ${data.data.userId}`);
    } catch (error) {
      this.logger.error('Error processing user registration', error);
    }
  }

  @EventPattern('user.login')
  async handleUserLogin(@Payload() data: MessageEvent) {
    this.logger.log('Received user.login event', data);
    
    try {
      // Handle user login event
      // Log login activity, update last login time, etc.
      
      this.logger.log(`Login processed for user: ${data.data.userId}`);
    } catch (error) {
      this.logger.error('Error processing user login', error);
    }
  }

  @MessagePattern('auth.verify-token')
  async verifyToken(@Payload() data: MessageEvent) {
    this.logger.log('Received auth.verify-token request', data);
    
    try {
      // Verify JWT token
      // Return token validation result
      
      return {
        valid: true,
        userId: data.data.userId,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error verifying token', error);
      return {
        valid: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  @EventPattern('user.password-reset')
  async handlePasswordReset(@Payload() data: MessageEvent) {
    this.logger.log('Received user.password-reset event', data);
    
    try {
      // Handle password reset event
      // Send password reset email, log security event, etc.
      
      this.logger.log(`Password reset processed for user: ${data.data.userId}`);
    } catch (error) {
      this.logger.error('Error processing password reset', error);
    }
  }
}
