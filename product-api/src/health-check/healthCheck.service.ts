import { PrismaHealthIndicator } from 'src/prisma/prisma.health';
import { Injectable } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealthService: PrismaHealthIndicator,
  ) {}

  @HealthCheck()
  async check() {
    return await this.health.check([
      async () => await this.prismaHealthService.isHealthy('database'),
    ]);
  }
}
