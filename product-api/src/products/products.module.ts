import { I18nHelperModule } from 'src/i18n/i18n.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsMicroserviceController } from './products-microservice.controller';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { AuthModule } from '../auth/auth.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [PrismaModule, I18nHelperModule, AuthModule, KafkaModule],
  controllers: [ProductsController, ProductsMicroserviceController],
  providers: [ProductsService, ProductsResolver, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
