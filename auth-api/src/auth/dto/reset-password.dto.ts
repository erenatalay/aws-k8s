import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail({}, { message: 'common.user.email.format' })
  @IsNotEmpty({ message: 'common.user.email.required' })
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'common.reset.code.required' })
  resetCode: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty({ message: 'common.user.password.required' })
  @MinLength(8, { message: 'common.user.password.minlength' })
  newPassword: string;
}
