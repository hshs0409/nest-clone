import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/*
guard는 함수인데 req를 다음 단계로 진행할지 말지 결정한다.
CanActivate는 true를 return하면 req 진행, false return하면 req 멈춘다.
execution context(NestJs)를 사용 -> pipeline의 context

gql context는 http와 다르기 때문에 바꿔줘야 한다.
*/

// 누가 자원을 요청하는지 확인하는 과정
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext(); // main의 gqlModule에서의 context와 같다는 것
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}
