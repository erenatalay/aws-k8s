import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsString()
  uuid: string;

  @Field()
  @IsString()
  oldPassword: string;

  @Field()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  @IsString()
  uuid: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstname?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastname?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  birthday?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;
}
