import { Module } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
