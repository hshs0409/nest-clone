import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInPut, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // 로그인 된 유저를 확인해주는 쿼리
  @Query(returns => User)
  confirmUser(@Context() context) {
    console.log(context);
  }

  @Mutation(returns => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CoreOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(returns => LoginOutput)
  login(@Args('input') loginInput: LoginInPut): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }
}

/*
nestjs와 Express의 middleware는 거의 비슷하다
요청 처리 후 next() 함수 호출
*/
