import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwksService } from './jwks.service';
import { JwksGuard } from './jwks.guard';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [JwksService, JwksGuard],
  exports: [JwksService, JwksGuard],
})
export class JwksModule {}
