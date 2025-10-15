import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwksService } from './jwks.service';
import { JwksController } from './jwks.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '1h'),
          issuer: configService.get('JWT_ISSUER', 'auth-service'),
          audience: configService.get('JWT_AUDIENCE', 'api-services'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwksService],
  controllers: [JwksController],
  exports: [JwksService],
})
export class JwksModule {}
