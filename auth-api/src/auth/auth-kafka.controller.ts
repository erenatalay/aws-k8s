import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

/**
 * Kafka Message Consumer Controller
 * Bu controller Kafka'dan gelen mesajları dinler ve işler
 * 
 * Kullanım: main.ts'de microservice olarak bağlanmalı
 */
@Controller()
export class AuthKafkaController {
  private readonly logger = new Logger(AuthKafkaController.name);

  /**
   * Kullanıcı kayıt eventlerini dinle
   * Topic: user.register
   */
  @MessagePattern('user.register')
  async handleUserRegister(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const topic = context.getTopic();
    const partition = context.getPartition();
    
    this.logger.log(
      `📥 Received user.register event - Topic: ${topic}, Partition: ${partition}, Offset: ${originalMessage.offset}`,
    );

    try {
      // İşlemleri gerçekleştir
      const { data } = message;
      
      // Örnek: Email gönder
      // await this.mailService.sendWelcomeEmail(data.email);
      
      // Örnek: Analytics'e kaydet
      // await this.analyticsService.trackSignup(data);
      
      this.logger.log(`✅ Successfully processed user registration: ${data.email}`);
      
      // Offset otomatik commit edilir
      return { success: true, userId: data.userId };
    } catch (error) {
      this.logger.error(`❌ Error processing user.register: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Kullanıcı giriş eventlerini dinle
   * Topic: user.login
   */
  @MessagePattern('user.login')
  async handleUserLogin(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const topic = context.getTopic();
    const partition = context.getPartition();
    
    this.logger.log(
      `📥 Login event - Topic: ${topic}, Partition: ${partition}, Offset: ${originalMessage.offset}`,
    );

    try {
      const { data } = message;
      
      // Örnek: Login analytics
      this.logger.log(`User ${data.userId} logged in from ${data.ipAddress}`);
      
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Error processing login: ${error.message}`);
      throw error;
    }
  }

  /**
   * Şifre sıfırlama isteklerini dinle
   * Topic: user.password.reset
   */
  @MessagePattern('user.password.reset')
  async handlePasswordReset(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const topic = context.getTopic();
    const partition = context.getPartition();
    
    this.logger.log(
      `📥 Password reset - Topic: ${topic}, Partition: ${partition}, Offset: ${originalMessage.offset}`,
    );

    try {
      const { data } = message;
      
      // Örnek: Reset email gönder
      // await this.mailService.sendPasswordResetEmail(data.email, data.resetToken);
      
      this.logger.log(`✅ Password reset email sent to ${data.email}`);
      
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Error processing password reset: ${error.message}`);
      throw error;
    }
  }

  /**
   * Toplu bildirim mesajlarını işle
   * Topic: notifications.batch
   * 
   * High-throughput scenario için batch processing
   */
  @MessagePattern('notifications.batch')
  async handleBatchNotifications(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const partition = context.getPartition();
    
    this.logger.log(`📦 Batch notifications - Partition: ${partition}, Offset: ${originalMessage.offset}`);

    try {
      const { data } = message;
      const notifications = data.notifications || [];
      
      this.logger.log(`Processing ${notifications.length} notifications`);
      
      // Batch processing
      const batchSize = 100;
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        // Process batch
        await this.processBatch(batch);
      }
      
      this.logger.log(`✅ Processed ${notifications.length} notifications`);
      
      return { success: true, processed: notifications.length };
    } catch (error) {
      this.logger.error(`❌ Error processing batch: ${error.message}`);
      throw error;
    }
  }

  /**
   * Request-Reply pattern örneği
   * Topic: user.verify.email
   */
  @MessagePattern('user.verify.email')
  async verifyEmail(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const partition = context.getPartition();
    
    this.logger.log(`📧 Email verification - Partition: ${partition}, Offset: ${originalMessage.offset}`);

    try {
      const { data } = message;
      
      // Email verification logic
      const isValid = await this.validateToken(data.token);
      
      if (isValid) {
        // Update user status
        this.logger.log(`✅ Email verified for user: ${data.userId}`);
        return { success: true, verified: true };
      } else {
        this.logger.warn(`⚠️  Invalid verification token for user: ${data.userId}`);
        return { success: false, verified: false, error: 'Invalid token' };
      }
    } catch (error) {
      this.logger.error(`❌ Error verifying email: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Helper method: Batch processing
   */
  private async processBatch(batch: any[]): Promise<void> {
    // Simulate batch processing
    await Promise.all(
      batch.map(async (item) => {
        // Process each item
        // await this.processNotification(item);
      }),
    );
  }

  /**
   * Helper method: Token validation
   */
  private async validateToken(token: string): Promise<boolean> {
    // Simulate token validation
    // In real scenario: check database, verify JWT, etc.
    return !!(token && token.length > 10);
  }
}
