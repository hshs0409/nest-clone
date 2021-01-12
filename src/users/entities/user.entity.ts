import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrpyt from 'bcrypt';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString()
  email: string;

  @Field(type => String)
  @Column()
  @IsString()
  password: string;

  @Field(type => UserRole)
  @Column()
  @IsEnum(UserRole)
  role: UserRole;

  @BeforeInsert()
  async hassPassword(): Promise<void> {}
}
/* 
Listener는 기본적으로 나의 Entity에 무슨 일이 생길 때 실행되는 것
특정 엔티티 event를 listen하는 사용자 로직이 있는 method를 가질 수 있다.

@AfterLoad
Entity를 load 할 때마다, load한 다음에 무언가 실행

BeforeInsert
Entity가 Insert 되기 전에 무언가를 실행

bcrpyt는 hash하고 hash를 확인하는 데 사용 default saltOrRounds = 10
*/
