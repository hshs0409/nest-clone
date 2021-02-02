import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

//Injectable일때만 inject 가능
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService, // module에 의해 export
    private readonly usersService: UsersService, // userModule에서 export
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt']; //Header를 가져다 씀
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.usersService.findById(decoded['id']); // 누군지 찾는다
          req['user'] = user; // req를 graphql resolver에 전달해줘야 한다.
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}

// export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
//   console.log(req.headers);
// }

/* 
implements는 이 class가 interface 처럼 행동하게 해주는 것이다.
express 서버 구현이나 똑같다.
req,res 를 받아서 어떤 처리를 해 준 다음 next() 호출

requset context는 각 request에서 사용 가능
context가 함수로 정의되면 매 req마다 호출 req property를 가진 obj를 받는다.
*/
