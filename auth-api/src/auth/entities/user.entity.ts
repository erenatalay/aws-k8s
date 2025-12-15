import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  phone?: string;
}

@ObjectType()
export class AuthResponse {
  @Field(() => ID)
  id: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
@Directive('@shareable')
export class MessageResponse {
  @Field()
  message: string;
}
