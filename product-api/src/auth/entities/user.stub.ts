import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

/**
 * User stub for Federation
 * Bu Product API'de sadece referans için kullanılır
 * Gerçek User bilgileri Auth API'den gelir
 */
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  @Directive('@external')
  id: string;
}
