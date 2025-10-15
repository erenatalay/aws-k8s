import { JwtAuthGuard } from 'src/auth/strategies/auth-guard.strategy';
import { CustomRequest } from 'src/common/request/customRequest';
import { I18nService } from 'src/i18n/i18n.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserChangePasswordRequestDto } from './dto/user-change-request.user.dto';
import { UserUpdateRequestDto } from './dto/user-update-request.dto';
import { UsersService } from './users.service';

@Controller({ path: 'user', version: '1' })
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18Service: I18nService,
  ) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: CustomRequest) {
    const userUuid = req.user?.id;

    if (!userUuid) {
      throw new NotFoundException({
        message: this.i18Service.translate('error.userNotFound.user'),
      });
    }

    const result = await this.usersService.getUserByUuid(userUuid);

    if (!result) {
      throw new NotFoundException({
        message: this.i18Service.translate('error.userNotFound.user'),
      });
    }

    return {
      message: this.i18Service.translate('common.user.info.success'),
      data: result,
    };
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User Change Password' })
  @ApiResponse({ status: 200, description: 'User change password success' })
  @ApiResponse({ status: 401, description: 'User password invalid' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserChangePasswordRequestDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async changePassword(
    @Req() req: CustomRequest,
    @Body() body: UserChangePasswordRequestDto,
  ): Promise<{ message: string; data: any }> {
    const userUuid = req.user?.id;

    if (!userUuid) {
      throw new NotFoundException({
        message: this.i18Service.translate('error.userNotFound.user'),
      });
    }

    const result = await this.usersService.changeUserPassword(
      userUuid,
      body.newPassword,
      body.oldPassword,
    );

    return {
      message: this.i18Service.translate('common.user.password.success'),
      data: result,
    };
  }
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async deleteCurrentUser(@Req() req: CustomRequest) {
    const userUuid = req.user?.id;

    if (!userUuid) {
      throw new NotFoundException({
        message: this.i18Service.translate('error.userNotFound.user'),
      });
    }

    const result = await this.usersService.getUserByUuid(userUuid);

    if (!result) {
      throw new NotFoundException({
        message: this.i18Service.translate('error.userNotFound.user'),
      });
    }

    await this.usersService.deleteUserMe(userUuid);

    return {
      message: this.i18Service.translate('common.user.delete.success'),
      data: result,
    };
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async updateCurrentUser(
    @Req() req: CustomRequest,
    @Body() body: UserUpdateRequestDto,
  ) {
    const userUuid = req.user?.id;

    if (!userUuid) {
      throw new NotFoundException({
        message: this.i18Service.translate('error.userNotFound.user'),
      });
    }

    const result = await this.usersService.updateUserMe(userUuid, body);

    return {
      message: this.i18Service.translate('common.user.update.success'),
      data: result,
    };
  }
}
