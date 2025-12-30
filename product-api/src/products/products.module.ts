import { I18nHelperModule } from 'src/i18n/i18n.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ProductsController } from './products.controller';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [PrismaModule, I18nHelperModule, AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsResolver, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
