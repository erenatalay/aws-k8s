import { I18nHelperModule } from 'src/i18n/i18n.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HashingService } from 'src/utils/hashing/hashing.module';
import { UuidModule } from 'src/utils/uuid/uuid.module';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, UuidModule, I18nHelperModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver, HashingService],
  exports: [UsersService],
})
export class UsersModule {}
