import { Injectable, Logger } from '@nestjs/common';

import { KafkaService } from './kafka.service';

export interface DLQMessage {
  originalTopic: string;
  originalMessage: any;
  error: string;
  retryCount: number;
  timestamp: Date;
  traceId?: string;
}

/**
 * Dead Letter Queue Service
 *
 * Başarısız mesajları DLQ topic'ine yönlendirir
 * Sektör standardı: Netflix, Uber, LinkedIn
 */
@Injectable()
export class DLQService {
  private readonly logger = new Logger(DLQService.name);
  private readonly MAX_RETRIES = 3;
  private readonly DLQ_SUFFIX = '.dlq';

  constructor(private readonly kafkaService: KafkaService) {}

  /**
   * Mesajı DLQ'ya gönder
   */
  async sendToDLQ(
    originalTopic: string,
    originalMessage: any,
    error: Error | string,
    retryCount: number = 0,
    traceId?: string,
  ): Promise<void> {
    const dlqTopic = `${originalTopic}${this.DLQ_SUFFIX}`;

    const dlqMessage: DLQMessage = {
      originalTopic,
      originalMessage,
      error: error instanceof Error ? error.message : error,
      retryCount,
      timestamp: new Date(),
      traceId,
    };

    try {
      await this.kafkaService.emit(dlqTopic, dlqMessage);
      this.logger.warn(
        `☠️ Message sent to DLQ: ${dlqTopic} | Retry: ${retryCount} | Error: ${dlqMessage.error}`,
      );
    } catch (dlqError) {
      this.logger.error(
        `❌ Failed to send message to DLQ: ${dlqTopic}`,
        dlqError,
      );
    }
  }

  /**
   * Mesajı retry et, max retry aşılırsa DLQ'ya gönder
   */
  async handleWithRetry<T>(
    topic: string,
    message: any,
    handler: () => Promise<T>,
    traceId?: string,
  ): Promise<T | null> {
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount < this.MAX_RETRIES) {
      try {
        return await handler();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        retryCount++;

        this.logger.warn(
          `⚠️ Retry ${retryCount}/${this.MAX_RETRIES} for topic: ${topic}`,
        );

        if (retryCount < this.MAX_RETRIES) {
          // Exponential backoff: 100ms, 200ms, 400ms...
          await this.delay(100 * Math.pow(2, retryCount - 1));
        }
      }
    }

    // Max retry aşıldı, DLQ'ya gönder
    await this.sendToDLQ(
      topic,
      message,
      lastError || 'Unknown error',
      retryCount,
      traceId,
    );

    return null;
  }

  /**
   * DLQ'daki mesajları yeniden işle (manual reprocessing)
   */
  async reprocessDLQ(
    dlqTopic: string,
    _handler: (message: DLQMessage) => Promise<void>,
  ): Promise<void> {
    this.logger.log(`🔄 Reprocessing DLQ: ${dlqTopic}`);
    // Bu method Kafka consumer tarafından çağrılacak
    // Implementation depends on your consumer setup
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Max retry sayısını al
   */
  getMaxRetries(): number {
    return this.MAX_RETRIES;
  }
}
