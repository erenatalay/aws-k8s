import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';

export interface JwkKey {
  kty: string;
  use: string;
  kid: string;
  n: string;
  e: string;
}

export interface JwksResponse {
  keys: JwkKey[];
}

@Injectable()
export class JwksService {
  private readonly logger = new Logger(JwksService.name);
  private jwksCache: Map<string, string> = new Map();
  private cacheExpiry: number = Date.now();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getJwks(): Promise<JwksResponse> {
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL', 'http://auth-api:3000');
    const jwksUrl = `${authServiceUrl}/.well-known/jwks.json`;

    try {
      const response = await firstValueFrom(this.httpService.get<JwksResponse>(jwksUrl));
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch JWKS from ${jwksUrl}`, error);
      throw new Error('Unable to fetch JWKS');
    }
  }

  async getPublicKey(kid: string): Promise<string> {
    // Check cache first (5 minute cache)
    if (this.jwksCache.has(kid) && Date.now() < this.cacheExpiry) {
      return this.jwksCache.get(kid);
    }

    const jwks = await this.getJwks();
    const jwk = jwks.keys.find(key => key.kid === kid);

    if (!jwk) {
      throw new Error(`JWK not found for kid: ${kid}`);
    }

    const pem = jwkToPem(jwk as any);
    
    // Cache the PEM for 5 minutes
    this.jwksCache.set(kid, pem);
    this.cacheExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    return pem;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      // Decode token header to get kid
      const decoded = jwt.decode(token, { complete: true }) as any;
      
      if (!decoded || !decoded.header.kid) {
        throw new Error('Invalid token: missing kid in header');
      }

      const publicKey = await this.getPublicKey(decoded.header.kid);
      
      // Verify token with public key
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: this.configService.get('JWT_ISSUER', 'auth-service'),
        audience: this.configService.get('JWT_AUDIENCE', 'api-services'),
      });

      return payload;
    } catch (error) {
      this.logger.error('Token verification failed', error);
      throw error;
    }
  }

  clearCache(): void {
    this.jwksCache.clear();
    this.cacheExpiry = 0;
  }
}
