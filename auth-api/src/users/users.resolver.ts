import { MessageResponse, User } from 'src/auth/entities/user.entity';
import {
  CurrentUser,
  CurrentUserPayload,
} from 'src/common/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
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

  @Query(() => User, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  async getMe(@CurrentUser() user: CurrentUserPayload): Promise<User> {
    return this.usersService.getUserByUuid(user.id);
  }


  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<User> {
    return this.usersService.getUserByUuid(reference.id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async changeUserPassword(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: ChangePasswordInput,
  ): Promise<User> {
    return this.usersService.changeUserPassword(
      user.id,
      input.newPassword,
      input.oldPassword,
    );
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @CurrentUser() user: CurrentUserPayload,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.updateUserMe(user.id, input as any);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(GqlAuthGuard)
  async deleteUser(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<MessageResponse> {
    await this.usersService.deleteUserMe(user.id);
    return { message: 'User deleted successfully' };
  }
}
