import { I18nService } from 'src/i18n/i18n.service';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { TokenService } from '../token/token.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthLoginRequestDto } from './dto/login-request-auth.dto';
import { AuthRegisterRequestDto } from './dto/register-request-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly i18nService: I18nService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
    type: AuthRegisterRequestDto,
  })
  @ApiBody({ type: AuthRegisterRequestDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerUserDto: AuthRegisterRequestDto) {
    const response =
      await this.authService.registerUserService(registerUserDto);
    return {
      message: this.i18nService.translate('common.auth.register.success'),
      data: response,
    };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify account with activation code' })
  @ApiResponse({
    status: 200,
    description: 'Account verified successfully',
  })
  @ApiBody({ type: VerifyAccountDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    await this.authService.verifyAccount(verifyAccountDto);
    return {
      message: this.i18nService.translate('common.auth.account.verified'),
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'User login successfully',
    type: AuthLoginRequestDto,
  })
  @ApiBody({ type: AuthLoginRequestDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: AuthLoginRequestDto) {
    const response = await this.authService.loginUserService(loginUserDto);
    return {
      message: this.i18nService.translate('common.auth.login.success'),
      data: response,
    };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Reset code sent to email',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {
      message: this.i18nService.translate('common.auth.forgot.password.success'),
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with code' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @ApiBody({ type: ResetPasswordDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return {
      message: this.i18nService.translate('common.auth.reset.password.success'),
    };
  }
}
