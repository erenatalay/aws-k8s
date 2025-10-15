import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

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
  private publicKey: string;
  private privateKey: string;
  private keyId: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.generateKeyPair();
  }

  private generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.keyId = crypto.randomUUID();
  }

  getJwks(): JwksResponse {
    const publicKeyObject = crypto.createPublicKey(this.publicKey);
    const jwk = publicKeyObject.export({ format: 'jwk' }) as any;

    return {
      keys: [
        {
          kty: jwk.kty,
          use: 'sig',
          kid: this.keyId,
          n: jwk.n,
          e: jwk.e,
        },
      ],
    };
  }

  signToken(payload: any): string {
    return this.jwtService.sign(payload, {
      privateKey: this.privateKey,
      algorithm: 'RS256',
      keyid: this.keyId,
    });
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      publicKey: this.publicKey,
      algorithms: ['RS256'],
    });
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  getKeyId(): string {
    return this.keyId;
  }
}
