import { MessageResponse, User } from 'src/auth/entities/user.entity';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';

import { ChangePasswordInput, UpdateUserInput } from './inputs/user.inputs';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'user' })
  async getUserByUuid(@Args('uuid') uuid: string): Promise<User> {
    return this.usersService.getUserByUuid(uuid);
  }

  // Federation: Di\u011fer subgraph'lar User bilgisi istedi\u011finde buraya d\u00fc\u015fer
  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<User> {
    return this.usersService.getUserByUuid(reference.id);
  }

  @Mutation(() => User)
  async changeUserPassword(
    @Args('input') input: ChangePasswordInput,
  ): Promise<User> {
    const { uuid, newPassword, oldPassword } = input;
    return this.usersService.changeUserPassword(uuid, newPassword, oldPassword);
  }

  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput): Promise<User> {
    const { uuid, ...payload } = input;
    return this.usersService.updateUserMe(uuid, payload as any);
  }

  @Mutation(() => MessageResponse)
  async deleteUser(@Args('uuid') uuid: string): Promise<MessageResponse> {
    await this.usersService.deleteUserMe(uuid);
    return { message: 'User deleted successfully' };
  }
}
