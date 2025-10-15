import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/validators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';


export class UserChangePasswordRequestDto {
  @ApiProperty({
    example: 'oldpassword123',
  })
  @IsString({ message: 'common.user.password.string' })
  @IsNotEmpty({ message: 'common.user.password.required' })
  @MinLength(6, { message: 'common.user.password.minlength' })
  oldPassword: string;

  @ApiProperty({
    example: 'newpassword123',
  })
  @IsString({ message: 'common.user.password.string' })
  @IsNotEmpty({ message: 'common.user.password.required' })
  @MinLength(6, { message: 'common.user.password.minlength' })
  newPassword: string;

  @ApiProperty({
    example: 'newpassword123',
  })
  @IsString({ message: 'common.user.password.string' })
  @IsNotEmpty({ message: 'common.user.password.required' })
  @MinLength(6, {
    message: 'common.user.password.minlength',
  })
  @Match('newPassword', { message: 'common.user.password.not.match' })
  confirmPassword: string;
}
