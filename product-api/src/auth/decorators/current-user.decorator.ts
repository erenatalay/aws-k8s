import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface CurrentUserData {
  userId: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData | undefined => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const gqlRequest = gqlContext.getContext()?.req;

    if (gqlRequest?.user) {
      return gqlRequest.user;
    }

    const request = ctx.switchToHttp().getRequest();
    return request?.user;
  },
);
