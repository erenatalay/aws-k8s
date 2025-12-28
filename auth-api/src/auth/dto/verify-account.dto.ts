import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccountDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail({}, { message: 'common.user.email.format' })
  @IsNotEmpty({ message: 'common.user.email.required' })
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'common.activation.code.required' })
  activationCode: string;
}
