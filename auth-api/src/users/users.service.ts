import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from 'src/utils/hashing/hashing.module';
import { UuidService } from 'src/utils/uuid/uuid.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { GetUserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
    private readonly i18nService: I18nService,
    private readonly hashingService: HashingService,
  ) {}

  async getUserByUuid(uuid: string): Promise<GetUserResponseDto> {
    if (!(await this.uuidService.validateUuid(uuid))) {
      throw new BadRequestException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }
    const user = await this.prismaService.users.findUnique({
      where: {
        id: uuid,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        socialProvider: true,
        phone: true,
        birthday: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }

    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone || '',
      birthday: user.birthday || undefined,
      avatar: user.avatar || '',
    };
  }
  async changeUserPassword(
    uuid: string,
    newPassword: string,
    oldPassword: string,
  ): Promise<GetUserResponseDto> {
    if (!(await this.uuidService.validateUuid(uuid))) {
      throw new BadRequestException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }

    const user = await this.prismaService.users.findUnique({
      where: {
        id: uuid,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }
    const isPasswordValid = await this.hashingService.comparePassword(
      oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: this.i18nService.translate(
          'error.userNotFound.invalid.password',
        ),
      });
    }
    const hashedPassword = await this.hashingService.hashPassword(newPassword);
    await this.prismaService.users.update({
      where: { id: uuid },
      data: { password: hashedPassword },
    });
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    };
  }
  async deleteUserMe(uuid: string): Promise<void> {
    if (!(await this.uuidService.validateUuid(uuid))) {
      throw new BadRequestException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }
    await this.prismaService.users.update({
      where: { id: uuid },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }
  async updateUserMe(
    uuid: string,
    user: {
      firstname: string;
      lastname: string;
      email: string;
      birthday: Date;
      phone: string;
      avatar: string;
    },
  ): Promise<GetUserResponseDto> {
    if (!(await this.uuidService.validateUuid(uuid))) {
      throw new BadRequestException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }

    const updatedUser = await this.prismaService.users.update({
      where: { id: uuid },
      data: user,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      phone: updatedUser.phone || '',
      birthday: updatedUser.birthday || undefined,
      avatar: updatedUser.avatar || '',
    };
  }
}
