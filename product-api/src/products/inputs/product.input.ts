import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @MaxLength(255)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;
}

@InputType()
export class QueryProductInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userId?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;
}
