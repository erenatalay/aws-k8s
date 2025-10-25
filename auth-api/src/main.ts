import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as hpp from 'hpp';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/error/http-exception-filter';
import { I18nValidationPipe } from './common/validate/i18n-validation.pipe';
import { I18nService } from './i18n/i18n.service';
import { SwaggerService } from './swagger/swagger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupGracefulShutdown({ app });

  app.setGlobalPrefix(
    configService.get<string>('API_GLOBAL_PREFIX', { infer: true }) ||
      'default-prefix',
  );

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(hpp());
  app.use(compression());
  app.use(cookieParser());

  const i18nService = app.get(I18nService);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new I18nValidationPipe(i18nService));

  const swaggerService = app.get(SwaggerService);
  swaggerService.setupSwagger(app);
  const PORT = configService.get<string>('API_PORT', { infer: true });

  app.enableCors({
    origin: [
      configService.get<string>('CORS_ORIGIN', { infer: true }),
      configService.get<string>('CORS_ORIGIN_LOCAL', { infer: true }),
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Microservice'i başlat
  await app.startAllMicroservices();
  Logger.log('🐰 RabbitMQ Microservice is listening on: auth_queue');

  await app.listen(
    configService.get<number>('API_PORT', { infer: true }),
    '0.0.0.0',
  );

  Logger.log(`� Application is running on: http://localhost:${PORT}/`);

  // RabbitMQ Microservice'i ayrı olarak başlat
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBITMQ_URL')!],
        queue: 'auth_queue',
        queueOptions: {
          durable: true,
        },
      },
    });

  await microservice.listen();
  Logger.log('� RabbitMQ Microservice is listening on: auth_queue');
}
void bootstrap();
