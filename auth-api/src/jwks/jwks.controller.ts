import { Controller, Get } from '@nestjs/common';
import { JwksService, JwksResponse } from './jwks.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('JWKS')
@Controller('.well-known')
export class JwksController {
  constructor(private readonly jwksService: JwksService) {}

  @Get('jwks.json')
  @ApiOperation({ summary: 'Get JSON Web Key Set' })
  @ApiResponse({
    status: 200,
    description: 'Returns the public keys for token verification',
  })
  getJwks(): JwksResponse {
    return this.jwksService.getJwks();
  }
}
