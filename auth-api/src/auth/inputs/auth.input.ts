import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstname: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastname: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class VerifyAccountInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  activationCode: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  resetCode: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword: string;
}
