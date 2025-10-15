import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { HealthService } from './healthCheck.service';

@Controller({ path: 'health', version: '1' })
@ApiTags('Health')
@ApiBearerAuth()
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  @HealthCheck()
  @ApiBody({ description: 'Health check' })
  @HttpCode(HttpStatus.OK)
  async check() {
    return await this.healthService.check();
  }
}
