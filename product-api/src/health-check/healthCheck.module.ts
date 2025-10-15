import { PrismaHealthIndicator } from 'src/prisma/prisma.health';
import { PrismaService } from 'src/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './healthCheck.controller';
import { HealthService } from './healthCheck.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthService, PrismaService, PrismaHealthIndicator],
})
export class HealthModule {}
