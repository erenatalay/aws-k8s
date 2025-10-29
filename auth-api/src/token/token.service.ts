import { Users } from 'generated/prisma';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
      const decoded = await this.jwtService.verify(token, { secret });

      // Kullanıcı bilgilerini veritabanından al
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
        role: 'user', // Eğer role sisteminiz varsa buradan alabilirsiniz
      };
    } catch (error) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.token.invalid'),
      });
    }
  }

  async createPasswordResetToken(user: Users) {
    const secret = this.configService.get<string>('JWT_SECRET');
    const passwordResetExpiresIn = this.configService.get<string>(
      'PASSWORD_RESET_EXPIRES_IN',
    );
    return this.jwtService.sign(
      { email: user.email, id: user.id, type: 'passwordReset' },
      { secret, expiresIn: passwordResetExpiresIn as any },
    );
  }

  async createAccessToken(user: Users) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') as any,
    });
  }

  async createRefreshToken(user: Users) {
    const payload = { email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as any,
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    let userEmail;
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      userEmail = decoded.email;
    } catch (error) {
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
