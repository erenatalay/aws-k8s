import { Partitioners } from 'kafkajs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'auth-service',
              brokers: configService
                .get<string>('KAFKA_BROKERS', 'localhost:9092')
                .split(','),
              // High-performance configuration
              connectionTimeout: 3000,
              requestTimeout: 30000,
              retry: {
                initialRetryTime: 100,
                retries: 8,
                maxRetryTime: 30000,
                multiplier: 2,
              },
              // Optimize for high throughput
              socketFactory: undefined,
            },
            consumer: {
              groupId: 'auth-consumer-group',
              // High-performance consumer settings
              sessionTimeout: 30000,
              rebalanceTimeout: 60000,
              heartbeatInterval: 3000,
              maxBytesPerPartition: 1048576, // 1MB per partition
              maxBytes: 10485760, // 10MB max fetch size
              maxWaitTimeInMs: 5000,
              retry: {
                initialRetryTime: 100,
                retries: 8,
                maxRetryTime: 30000,
                multiplier: 2,
              },
              // Allow auto commit for better performance
              allowAutoTopicCreation: true,
              maxInFlightRequests: 5,
            },
            producer: {
              // High-performance producer settings
              allowAutoTopicCreation: true,
              transactionTimeout: 60000,
              createPartitioner: Partitioners.LegacyPartitioner,
              // Batch settings for high throughput
              maxInFlightRequests: 5,
              idempotent: false, // Set to true for exactly-once semantics
              compression: 1, // Gzip compression for network optimization
              retry: {
                initialRetryTime: 100,
                retries: 8,
                maxRetryTime: 30000,
                multiplier: 2,
              },
            },
            // Message handling settings
            send: {
              // Batch messages for better throughput
              timeout: 30000,
              acks: 1, // Wait for leader acknowledgment (balance between speed and safety)
            },
            // Subscribe configuration
            subscribe: {
              fromBeginning: false, // Only process new messages
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService, ClientsModule],
})
export class KafkaModule {}
