import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CoreOutput> {
    try {
      const exists = await this.userRepository.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: `User ${email} already exist`,
        };
      }
      await this.userRepository.save(
        this.userRepository.create({ email, password, role }),
      );
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
}

/*
email 가진 유저 찾고
password 맞는지 체크하고
JWT 만들고 User에게 주기

password 체크는 db에 저장된 hashed password와 user가 제공한 hash한 password가 같은지 비교를 하는 것
*/
