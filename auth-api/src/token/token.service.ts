import { Users } from 'generated/prisma';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

interface JwtPayload {
  id: string;
  email?: string;
  type?: string;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private i18nService: I18nService,
  ) {}

  async verifyToken(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify<JwtPayload>(token, { secret });

      const user = await this.prismaService.users.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException({
          message: this.i18nService.translate('error.user.notFound'),
        });
      }

      return {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: 'user',
      };
    } catch (_error) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.token.invalid'),
      });
    }
  }

  createPasswordResetToken(user: Users): string {
    const expiresIn =
      this.configService.get<string>('PASSWORD_RESET_EXPIRES_IN') ?? '15m';
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    };
    return this.jwtService.sign(
      { email: user.email, id: user.id, type: 'passwordReset' },
      options,
    );
  }

  createAccessToken(user: Users): string {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') ?? '1h';
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    };
    return this.jwtService.sign({ id: user.id }, options);
  }

  createRefreshToken(user: Users): string {
    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    };
    return this.jwtService.sign({ email: user.email }, options);
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    let userEmail: string;
    try {
      const decoded = this.jwtService.verify<{ email: string }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      userEmail = decoded.email;
    } catch (_error) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.token.invalid'),
      });
    }

    const user = await this.prismaService.users.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.token.invalid'),
      });
    }

    return this.createAccessToken(user);
  }
}
