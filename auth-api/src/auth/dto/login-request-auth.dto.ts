import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginRequestDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail({}, { message: 'common.user.email.format' })
  @IsNotEmpty({ message: 'common.user.email.required' })
  @Transform(lowerCaseTransformer)
  @MinLength(2, { message: 'common.user.email.minlength' })
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString({ message: 'common.user.password.string' })
  @IsNotEmpty({ message: 'common.user.password.required' })
  @MinLength(6, { message: 'common.user.password.minlength' })
  password: string;
}
