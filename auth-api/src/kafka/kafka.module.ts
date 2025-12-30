import { Partitioners } from 'kafkajs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DLQService } from './dlq.service';
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
              connectionTimeout: 3000,
              requestTimeout: 30000,
              retry: {
                initialRetryTime: 100,
                retries: 8,
                maxRetryTime: 30000,
                multiplier: 2,
              },
              socketFactory: undefined,
            },
            consumer: {
              groupId: 'auth-consumer-group',
              sessionTimeout: 30000,
              rebalanceTimeout: 60000,
              heartbeatInterval: 3000,
              maxBytesPerPartition: 1048576,
              maxBytes: 10485760,
              maxWaitTimeInMs: 5000,
              retry: {
                initialRetryTime: 100,
                retries: 8,
                maxRetryTime: 30000,
                multiplier: 2,
              },
              allowAutoTopicCreation: true,
              maxInFlightRequests: 5,
            },
            producer: {
              allowAutoTopicCreation: true,
              transactionTimeout: 60000,
              createPartitioner: Partitioners.LegacyPartitioner,
              maxInFlightRequests: 5,
              idempotent: false,
              compression: 1,
              retry: {
                initialRetryTime: 100,
                retries: 8,
                maxRetryTime: 30000,
                multiplier: 2,
              },
            },
            send: {
              timeout: 30000,
              acks: 1,
            },
            subscribe: {
              fromBeginning: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaService, DLQService],
  exports: [KafkaService, DLQService, ClientsModule],
})
export class KafkaModule {}
