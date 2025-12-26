import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface CurrentUserData {
  userId: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: string;
}

/**
 * Custom decorator to extract current user from request
 * Works for both REST and GraphQL contexts
 * Usage: @CurrentUser() user: CurrentUserData
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData | undefined => {
    // Try GraphQL context first
    const gqlContext = GqlExecutionContext.create(ctx);
    const gqlRequest = gqlContext.getContext()?.req;

    if (gqlRequest?.user) {
      return gqlRequest.user;
    }

    // Fall back to HTTP context
    const request = ctx.switchToHttp().getRequest();
    return request?.user;
  },
);
