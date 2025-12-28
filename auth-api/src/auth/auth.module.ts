import { I18nHelperModule } from 'src/i18n/i18n.module';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingModule } from 'src/utils/hashing/hashing.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthMicroserviceController } from './auth-microservice.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KafkaModule } from '../kafka/kafka.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    HashingModule,
    PrismaModule,
    I18nHelperModule,
    MailModule,
    TokenModule,
    KafkaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
            '7d') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AuthMicroserviceController],
  providers: [AuthService, AuthResolver, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
