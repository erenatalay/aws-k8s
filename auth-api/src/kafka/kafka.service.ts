import { Observable } from 'rxjs';
import { Injectable, Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export interface KafkaMessageEvent {
  pattern: string;
  data: any;
  timestamp: Date;
  source: string;
  traceId?: string;
}

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private isConnected = false;

  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onApplicationBootstrap() {
    try {
      // Subscribe to response topics if needed
      const responseTopics = ['auth.response', 'user.response'];
      
      responseTopics.forEach((topic) => {
        this.client.subscribeToResponseOf(topic);
      });

      await this.client.connect();
      this.isConnected = true;
      this.logger.log('✅ Successfully connected to Kafka cluster');
      this.logger.log('📊 Ready to handle high-volume requests');
    } catch (error) {
      this.logger.error('❌ Failed to connect to Kafka', error);
      this.logger.warn('⚠️  Application will continue without Kafka connection');
    }
  }

  /**
   * Emit event without expecting response - Fire and forget pattern
   * Best for high-throughput scenarios
   */
  async emit(pattern: string, data: any): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn('Kafka not connected, skipping emit');
      return;
    }

    const message: KafkaMessageEvent = {
      pattern,
      data,
      timestamp: new Date(),
      source: 'auth-service',
      traceId: this.generateTraceId(),
    };

    try {
      this.client.emit(pattern, message);
      this.logger.debug(`📤 Event emitted: ${pattern}`);
    } catch (error) {
      this.logger.error(`❌ Failed to emit event: ${pattern}`, error);
      throw error;
    }
  }

  /**
   * Send request and wait for response - Request-reply pattern
   * Use sparingly for critical operations
   */
  send<TResult = any>(pattern: string, data: any): Observable<TResult> {
    if (!this.isConnected) {
      this.logger.warn('Kafka not connected, cannot send message');
      throw new Error('Kafka service is not connected');
    }

    const message: KafkaMessageEvent = {
      pattern,
      data,
      timestamp: new Date(),
      source: 'auth-service',
      traceId: this.generateTraceId(),
    };

    this.logger.debug(`📨 Sending message: ${pattern}`);
    
    try {
      return this.client.send<TResult>(pattern, message);
    } catch (error) {
      this.logger.error(`❌ Failed to send message: ${pattern}`, error);
      throw error;
    }
  }

  /**
   * Emit batch of events for better throughput
   * Optimized for high-volume scenarios
   */
  async emitBatch(pattern: string, dataArray: any[]): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn('Kafka not connected, skipping batch emit');
      return;
    }

    const batchSize = 1000; // Process in batches of 1000
    const chunks = this.chunkArray(dataArray, batchSize);

    this.logger.log(
      `📦 Emitting batch: ${dataArray.length} messages in ${chunks.length} chunks`,
    );

    for (const chunk of chunks) {
      const promises = chunk.map((data) => this.emit(pattern, data));
      await Promise.all(promises);
    }

    this.logger.log(`✅ Batch emission completed: ${dataArray.length} messages`);
  }

  /**
   * Subscribe to a topic for consuming messages
   */
  subscribeToTopic(topic: string): void {
    this.client.subscribeToResponseOf(topic);
    this.logger.log(`🔔 Subscribed to topic: ${topic}`);
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Generate unique trace ID for distributed tracing
   */
  private generateTraceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Split array into chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Graceful shutdown
   */
  async onModuleDestroy() {
    try {
      await this.client.close();
      this.isConnected = false;
      this.logger.log('👋 Disconnected from Kafka');
    } catch (error) {
      this.logger.error('Error during Kafka disconnect', error);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    return this.isConnected;
  }
}
