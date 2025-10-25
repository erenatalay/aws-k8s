import { I18nHelperModule } from 'src/i18n/i18n.module';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingModule } from 'src/utils/hashing/hashing.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMicroserviceController } from './auth-microservice.controller';
import { TokenModule } from '../token/token.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    HashingModule,
    PrismaModule,
    I18nHelperModule,
    MailModule,
    TokenModule,
    RabbitmqModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '7d') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AuthMicroserviceController],
  providers: [
    AuthService, 
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
