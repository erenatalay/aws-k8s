import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

export interface JwtPayload {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * JWT doğrulandıktan sonra payload'ı döndürür
   * DB lookup YAPMIYORUZ - token self-contained
   * Bu sayede Kafka round-trip yok, ~1ms validation
   */
  async validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.id,
      userId: payload.id,
      uuid: payload.id,
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
    };
  }
}
