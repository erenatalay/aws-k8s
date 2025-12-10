import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { User, AuthResponse, MessageResponse } from './entities/user.entity';
import {
  RegisterInput,
  LoginInput,
  VerifyAccountInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './inputs/auth.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    const result = await this.authService.registerUserService(registerInput);
    return result as AuthResponse;
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    const result = await this.authService.loginUserService(loginInput);
    return result as AuthResponse;
  }

  @Mutation(() => MessageResponse)
  async verifyAccount(
    @Args('verifyAccountInput') verifyAccountInput: VerifyAccountInput,
  ): Promise<MessageResponse> {
    await this.authService.verifyAccount(verifyAccountInput);
    return { message: 'Account verified successfully' };
  }

  @Mutation(() => MessageResponse)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ): Promise<MessageResponse> {
    await this.authService.forgotPassword(forgotPasswordInput);
    return { message: 'Password reset code sent successfully' };
  }

  @Mutation(() => MessageResponse)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ): Promise<MessageResponse> {
    await this.authService.resetPassword(resetPasswordInput);
    return { message: 'Password reset successfully' };
  }

  @Query(() => String)
  async hello(): Promise<string> {
    return 'Hello from Auth GraphQL API!';
  }
}
