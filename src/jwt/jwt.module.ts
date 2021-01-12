import { DynamicModule, Global, Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CONFIG_OPTOINS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({})
@Global() // global module로 만들어줘 다른 모듈에서 import할 필요 없게 해줌
export class JwtModule {
  // custom Static Module
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        // {
        //   provide: JwtService, // provide하는 것이 jwtservice
        //   useClass: JwtService, //원하는 클래스를 provide 해주뮤
        // },
        {
          provide: CONFIG_OPTOINS,
          useValue: options,
        },
        JwtService,
        // 이 처럼 하면 bananas로 다른 module에서 부를 수 있다. jwtservice를 @Inject('bananas')
      ],
      exports: [JwtService],
    };
  }
}
