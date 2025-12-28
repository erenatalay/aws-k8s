import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateRequestDto {
  @ApiProperty({
    example: 'John',
  })
  @IsString({ message: 'common.user.firstname.string' })
  @IsNotEmpty({ message: 'common.user.firstname.required' })
  firstname: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString({ message: 'common.user.lastname.string' })
  @IsNotEmpty({ message: 'common.user.lastname.required' })
  lastname: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date in ISO format (YYYY-MM-DD)',
  })
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate({ message: 'common.user.birthday.format' })
  @IsOptional()
  birthday: Date;

  @ApiProperty({
    example: '+1234567890',
  })
  @IsString({ message: 'common.user.phone.format' })
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'common.user.email.format' })
  @IsNotEmpty({ message: 'common.user.email.required' })
  email: string;

  @IsString({ message: 'common.user.avatar.string' })
  @IsOptional()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL of the user avatar',
  })
  avatar: string;
}
