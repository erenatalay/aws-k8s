import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { I18nService } from '../i18n/i18n.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from '../utils/hashing/hashing.module';
import { JwksService } from '../jwks/jwks.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { AuthProviderEnum } from './auth.types';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthLoginRequestDto } from './dto/login-request-auth.dto';
import { AuthLoginResponseDto } from './dto/login.response-auth.dto';
import { AuthRegisterRequestDto } from './dto/register-request-auth.dto';
import { AuthRegisterResponseDto } from './dto/register.response-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly jwksService: JwksService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  private generateActivationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async registerUserService(
    registerUserDto: AuthRegisterRequestDto,
  ): Promise<AuthRegisterResponseDto> {
    const { firstname, lastname, email, password } = registerUserDto;

    const existingActiveUser = await this.prismaService.users.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (existingActiveUser) {
      throw new UnprocessableEntityException({
        message: this.i18nService.translate('error.user.aldready.exist'),
      });
    }

    const softDeletedUser = await this.prismaService.users.findFirst({
      where: {
        email,
        NOT: { deletedAt: null },
      },
    });

    const activationCode = this.generateActivationCode();
    const hashedPassword = await this.hashingService.hashPassword(password);

    let user;

    if (softDeletedUser) {
      user = await this.prismaService.users.update({
        where: { id: softDeletedUser.id },
        data: {
          firstname,
          lastname,
          password: hashedPassword,
          socialProvider: AuthProviderEnum.DEFAULT,
          deletedAt: null,
          isActive: false,
          activationCode,
        },
      });
    } else {
      user = await this.prismaService.users.create({
        data: {
          firstname,
          lastname,
          email,
          password: hashedPassword,
          socialProvider: AuthProviderEnum.DEFAULT,
          isActive: false,
          activationCode,
        },
      });
    }

    await this.mailService.userSignUp({
      to: email,
      data: { 
        hash: activationCode,
      }
    });

    // Register event'ini RabbitMQ'ya gönder
    this.rabbitmqService.emit('user.registered', {
      userId: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      registrationTime: new Date(),
      activationRequired: true,
    });

    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      birthday: user.birthday || undefined,
      phone: user.phone || '',
      avatar: user.avatar || '',
    };
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto): Promise<void> {
    const { email, activationCode } = verifyAccountDto;

    const user = await this.prismaService.users.findFirst({
      where: {
        email,
        activationCode,
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: this.i18nService.translate('error.invalid.activation.code'),
      });
    }

    await this.prismaService.users.update({
      where: { id: user.id },
      data: {
        isActive: true,
        activationCode: null,
      },
    });
  }

  async loginUserService(
    loginUserDto: AuthLoginRequestDto,
  ): Promise<AuthLoginResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.prismaService.users.findFirst({
      where: {
        email,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!user) {
      const deletedUser = await this.prismaService.users.findFirst({
        where: {
          email,
          NOT: { deletedAt: null },
        },
      });

      if (deletedUser) {
        throw new UnauthorizedException({
          message: this.i18nService.translate('error.user.account.deleted'),
        });
      }

      const inactiveUser = await this.prismaService.users.findFirst({
        where: {
          email,
          isActive: false,
          deletedAt: null,
        },
      });

      if (inactiveUser) {
        throw new UnauthorizedException({
          message: this.i18nService.translate('error.user.account.not.activated'),
        });
      }

      throw new UnauthorizedException({
        message: this.i18nService.translate('error.userNotFound.email'),
      });
    }

    const isPasswordValid = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException({
        message: this.i18nService.translate(
          'error.userNotFound.invalid.password',
        ),
      });

    // JWT token oluştur
    const tokenPayload = {
      sub: user.id, // Standard JWT subject claim
      userId: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: 'user', // Default role, gerekirse database'den alınabilir
      iat: Math.floor(Date.now() / 1000),
    };

    const accessToken = this.jwksService.signToken(tokenPayload);
    
    // Refresh token için aynı payload kullan ama daha uzun expiry
    const refreshTokenPayload = {
      ...tokenPayload,
      type: 'refresh',
    };
    const refreshToken = this.jwksService.signToken(refreshTokenPayload);

    // Login event'ini RabbitMQ'ya gönder
    this.rabbitmqService.emit('user.login', {
      userId: user.id,
      email: user.email,
      loginTime: new Date(),
      userAgent: 'api-login', // Request'ten alınabilir
    });

    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      birthday: user.birthday || undefined,
      phone: user.phone || '',
      avatar: user.avatar || '',
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.prismaService.users.findFirst({
      where: {
        email,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: this.i18nService.translate('error.userNotFound.email'),
      });
    }

    const resetCode = this.generateRandomCode();

    const expiresInMinutes = parseInt(
      this.configService.get<string>('PASSWORD_RESET_EXPIRES_IN', '15m').replace('m', ''),
      10
    );
    const resetExpire = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await this.prismaService.users.update({
      where: { id: user.id },
      data: {
        resetCode,
        resetExpire,
      },
    });

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash: resetCode,
        tokenExpires: resetExpire.getTime(),
      },
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, resetCode, newPassword } = resetPasswordDto;

    const user = await this.prismaService.users.findFirst({
      where: {
        email,
        resetCode,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: this.i18nService.translate('error.invalid.reset.code'),
      });
    }

    if (!user.resetExpire || user.resetExpire < new Date()) {
      await this.prismaService.users.update({
        where: { id: user.id },
        data: {
          resetCode: null,
          resetExpire: null,
        },
      });
      
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.reset.code.expired'),
      });
    }

    const hashedPassword = await this.hashingService.hashPassword(newPassword);

    await this.prismaService.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetExpire: null,
      },
    });
  }
}
