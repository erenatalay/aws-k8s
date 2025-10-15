import { Strategy, ExtractJwt } from 'passport-jwt';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error(i18nService.translate('error.config.jwt_secret'));
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { id: string }) {
    const user = (await this.prismaService.users.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, firstname: true, lastname: true },
    })) as {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
    } | null;

    if (!user) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }

    return {
      id: user.id,
      uuid: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    };
  }
}
