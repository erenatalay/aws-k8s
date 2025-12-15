import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

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
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
