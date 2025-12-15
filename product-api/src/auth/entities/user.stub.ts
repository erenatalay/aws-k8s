import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

/**
 * User stub for Federation
 * Bu Product API'de sadece referans i\u00e7in kullan\u0131l\u0131r
 * Ger\u00e7ek User bilgileri Auth API'den gelir
 */
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  @Directive('@external')
  id: string;
}
