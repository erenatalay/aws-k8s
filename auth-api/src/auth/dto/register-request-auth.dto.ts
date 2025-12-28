import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterRequestDto {
  @ApiProperty({ example: 'John', type: String })
  @IsString({ message: 'common.user.firstname.string' })
  @IsNotEmpty({ message: 'common.user.firstname.required' })
  @MinLength(2, { message: 'common.user.firstname.minlength' })
  firstname: string;

  @ApiProperty({ example: 'Doe', type: String })
  @IsString({ message: 'common.user.lastname.string' })
  @IsNotEmpty({ message: 'common.user.lastname.required' })
  @MinLength(2, { message: 'common.user.lastname.minlength' })
  lastname: string;

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
