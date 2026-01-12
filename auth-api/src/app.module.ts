import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import { join } from 'path';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.contoller';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health-check/healthCheck.module';
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
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,

      autoSchemaFile: {
        path:
          process.env.AUTO_SCHEMA_FILE ||
          (process.env.NODE_ENV === 'production' ||
          process.env.DOCKER === 'true' ||
          process.cwd() === '/app'
            ? '/tmp/schema.gql'
            : join(process.cwd(), 'src/schema.gql')),
        federation: {
          version: 2,
          importUrl: 'https://specs.apollo.dev/federation/v2.5',
        },
      },
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      path: '/api/graphql',
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    SwaggerModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
