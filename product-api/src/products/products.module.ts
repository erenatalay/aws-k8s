import { I18nHelperModule } from 'src/i18n/i18n.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwksModule } from '../jwks/jwks.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    PrismaModule,
    I18nHelperModule,
    JwksModule,
    RabbitmqModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    PrismaService, 
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
