import { I18nHelperModule } from 'src/i18n/i18n.module';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingModule } from 'src/utils/hashing/hashing.service';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwksModule } from '../jwks/jwks.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    HashingModule,
    PrismaModule,
    I18nHelperModule,
    MailModule,
    JwksModule,
    RabbitmqModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
