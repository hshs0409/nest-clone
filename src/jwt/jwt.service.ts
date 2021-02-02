import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTOINS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTOINS) private readonly options: JwtModuleOptions,
  ) {}

  // token 생성 ( login에서 사용 )
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey);
  }

  // 만들어진 token 체크 ( 인증 등에서 사용)
  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
