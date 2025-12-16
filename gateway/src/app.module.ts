import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const getEnvVar = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: ({ req }: { req: Request }) => ({ req }),
        formatError: (error) => {
          // Return proper HTTP status codes for errors
          return {
            message: error.message,
            extensions: {
              ...error.extensions,
              code: error.extensions?.code || 'BAD_REQUEST',
              http: {
                status: error.extensions?.code === 'UNAUTHENTICATED' ? 401 : 
                        error.extensions?.code === 'FORBIDDEN' ? 403 : 400
              }
            }
          };
        },
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'auth',
              url: getEnvVar(
                'AUTH_GRAPHQL_URL',
                'http://localhost:3001/api/graphql',
              ),
            },
            {
              name: 'product',
              url: getEnvVar(
                'PRODUCT_GRAPHQL_URL',
                'http://localhost:3002/api/graphql',
              ),
            },
          ],
          pollIntervalInMs: 10000,
          introspectionHeaders: {
            'Content-Type': 'application/json',
          },
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
