import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.contoller';
import { HealthModule } from './health-check/healthCheck.module';
import { JwksModule } from './jwks/jwks.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { SwaggerModule } from './swagger/swagger.module';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      loader: I18nJsonLoader,
      resolvers: [
        new AcceptLanguageResolver(),
        new HeaderResolver(['Accept-Language']),
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    SwaggerModule,
    HealthModule,
    JwksModule,
    ProductsModule,
    RabbitmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}