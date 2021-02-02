import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInPut, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({ email, password, role }: CreateAccountInput): Promise<CoreOutput> {
    try {
      const exists = await this.userRepository.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: `User ${email} already exist`,
        };
      }
      await this.userRepository.save(this.userRepository.create({ email, password, role }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: `User can't created`,
      };
    }
  }

  async login({ email, password }: LoginInPut): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: `User not found`,
        };
      }
      const checked = await user.checkPassword(password);
      if (!checked) {
        return {
          ok: false,
          error: `Password not correct`,
        };
      }
      const token = this.jwtService.sign(user.id); // payload =>
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Can't not login`,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async userProfile({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.userRepository.findOne(userId);
      if (!user) {
        return {
          ok: false,
          error: 'User Not Found',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Can't find user`,
      };
    }
  }
}

/*
email 가진 유저 찾고
password 맞는지 체크하고
JWT 만들고 User에게 주기

password 체크는 db에 저장된 hashed password와 user가 제공한 hash한 password가 같은지 비교를 하는 것

dependency Injection => 원하는 것의 class를 적어주면 nestJS가 정보를 가져다준다.

token을 유저에게 지정해주면 사용자는 자기 token 안에 뭐가 들었는지 볼 수 있다.
privateKey를 주는 이유는 개발자가 사용자가 token을 수정했는지를 확인할 수 있어서, 사용자가 정보를 수정할 경우 개발자도 인지 가능
jwt의 목적은 비밀유지가 아니다. 내부에 담겨진 정보 자체가 아닌, 정보의 진위 여부가 중요
이 token이 우리의 것인지, 아무도 수정하지 않았는지
*/
