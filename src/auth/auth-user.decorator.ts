import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context).getContext();
  const user = gqlContext['user'];
  return user;
});

/*
Decorator는 context를 가져다가 gqlContext를 가져온다.
user를 가져오면 user를 return 해준다.
*/
