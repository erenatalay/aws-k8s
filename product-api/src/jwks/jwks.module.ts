import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwksGuard } from './jwks.guard';
import { JwksService } from './jwks.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [JwksService, JwksGuard],
  exports: [JwksService, JwksGuard],
})
export class JwksModule {}
