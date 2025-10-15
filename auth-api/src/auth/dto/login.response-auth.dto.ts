import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginResponseDto {
  @ApiProperty({ example: '1', type: String })
  @IsNotEmpty()
  id: string;
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsNotEmpty()
  birthday?: Date;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  phone: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
