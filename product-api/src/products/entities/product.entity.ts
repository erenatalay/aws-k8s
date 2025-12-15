import { ObjectType, Field, ID, Float, Int, Directive } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.stub';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field()
  userId: string;

  // Federation: owner Auth API'den gelecek
  @Field(() => User, { nullable: true })
  owner?: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProductsResponse {
  @Field(() => [Product])
  data: Product[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
@Directive('@shareable')
export class MessageResponse {
  @Field()
  message: string;
}
