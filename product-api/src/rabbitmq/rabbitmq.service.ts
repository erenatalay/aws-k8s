import { Observable } from 'rxjs';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface MessageEvent {
  pattern: string;
  data: any;
  timestamp: Date;
  source: string;
}

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.client.connect();
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      this.logger.warn('Application will continue without RabbitMQ connection');
    }
  }

  emit(pattern: string, data: any): Observable<any> {
    this.logger.log(`Emitting message: ${pattern}`, JSON.stringify(data));
    // Direkt data gönder, wrapper kullanma
    return this.client.emit(pattern, data);
  }

  send(pattern: string, data: any): Observable<any> {
    this.logger.log(`Sending message: ${pattern}`, JSON.stringify(data));
    // Direkt data gönder, wrapper kullanma
    return this.client.send(pattern, data);
  }

  async close(): Promise<void> {
    await this.client.close();
    this.logger.log('Disconnected from RabbitMQ');
  }
}
