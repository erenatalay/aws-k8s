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
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.contoller';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health-check/healthCheck.module';
import { KafkaModule } from './kafka/kafka.module';
import { PrismaModule } from './prisma/prisma.module';
import { SwaggerModule } from './swagger/swagger.module';
import { UsersModule } from './users/users.module';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    SwaggerModule,
    HealthModule,
    KafkaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}