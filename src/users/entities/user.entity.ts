import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(type => String)
  @Column({ unique: true })
  @IsString()
  email: string;

  @Field(type => String)
  @Column({ select: false })
  @IsString()
  password: string;

  @Field(type => UserRole)
  @Column()
  @IsEnum(UserRole)
  role: UserRole;

  @Field(type => [Restaurant])
  @OneToMany(type => Restaurant, restaurant => restaurant.owner)
  restaurants: Restaurant[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(inputPassword: string): Promise<boolean> {
    try {
      const ok = bcrypt.compare(inputPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
/* 
Listener는 기본적으로 나의 Entity에 무슨 일이 생길 때 실행되는 것
특정 엔티티 event를 listen하는 사용자 로직이 있는 method를 가질 수 있다.

@AfterLoad
Entity를 load 할 때마다, load한 다음에 무언가 실행

BeforeInsert
Entity가 Insert 되기 전에 무언가를 실행

bcrypt는 hash하고 hash를 확인하는 데 사용 default saltOrRounds = 10

* ON DELETE SET NULL
* ON UPDATE SET NULL
옵션 SET NULL -> 부모테이블에서 primary 값이 수정 또는 삭제될 경우
하위테이블의 reference값은 존재할 수 없습니다. 옵션이 없을 경우는 에러가 발생하고 옵션 SET NULL 로 정의되면 하위테이블의 reference값이  NULL 값으로 변경되면서 참조무결성을 유지합니다.

* ON UPDATE CASCADE
옵션 CASCADE -> 부모테이블에서 primary 값이 수정될 경우
옵션 CASCADE 로 정의되면 하위테이블의 reference값은 변경된 상위테이블의 수정된 값을 가지면서 참조무결성을 유지합니다.

* ON DELETE CASCADE
옵션 CASCADE -> 부모테이블에서 primary 값이 삭제될 경우
옵션 CASCADE 로 정의되면 하위테이블의 reference값은 삭제되면서 참조무결성을 유지합니다.
*/
