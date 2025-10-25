import { I18nHelperModule } from 'src/i18n/i18n.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsMicroserviceController } from './products-microservice.controller';
import { ProductsService } from './products.service';
import { AuthModule } from '../auth/auth.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    PrismaModule,
    I18nHelperModule,
    AuthModule,
    RabbitmqModule,
  ],
  controllers: [ProductsController, ProductsMicroserviceController],
  providers: [
    ProductsService, 
    PrismaService, 
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
