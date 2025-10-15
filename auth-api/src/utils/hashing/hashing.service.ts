import { Module } from '@nestjs/common';
import { HashingService } from './hashing.module';

@Module({
  providers: [HashingService],
  exports: [HashingService],
})
export class HashingModule {}
