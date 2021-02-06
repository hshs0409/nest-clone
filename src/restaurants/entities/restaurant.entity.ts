/*
Entity => Db model이라고 생각하면 편하다
Entity는 db에 저장되는 데이터의 형태
DB table에 매핑되는 클래스

TS를 이용해 DB에 있는 Entity에 어떻게 접근할까? => Repository 사용
Active Record vs Data Mapper => NestJS 에는 후자 
Data Mapper에서는 우선 Repository 사용  = Entity랑 상호작용하는 것을 담당
Entity랑 실제로 상호작용하는 레포지토리만 추가적으로 필요

둘 중 뭘 사용해야 할까 ? 장 단점 이 있다.
전자는 소규매 앱에서 단순하게 사용하기 좋다.
후자는 유지보수가 편하고 대규모 앱에서 사용한다

레포지토리를 사용하는 모듈을 쓸 수 있기에 Data Mapper 사용
레포지토리를 사용하면 Inject 하는 순간 어디서든지 접근할 수 있기 때문
구현하는 서비스에서나 테스팅할 때도 접근 가능
*/

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Category } from './category.entity';

// Entity에서 GraphQL, typeORM(Entity), Dto 모두 만들 수 있다. Dto=> Mapped Types 이용

@InputType('RestaurantInputType', { isAbstract: true }) // isAbstract => Schema Type으로 쓰지 않는다. 스키마는 유일한 이름의 Type을 가져야 하기 때문
@ObjectType() // 자동으로 스키마를 빌드하기 위해 사용하는 gql decorator // GQL에서 받아온 타입
@Entity() // typeORM 부분
export class Restaurant extends CoreEntity {
  @Field(type => String) // returnTypeFunction으로 첫 번째 arg로써 function을 요청한다. _ => (),  =>  아무거나 상관 x
  @Column({ unique: true })
  @IsString()
  name: string;

  @Field(type => String)
  @Column()
  @IsString()
  address: string;

  @Field(type => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field(type => Category, { nullable: true })
  @ManyToOne(type => Category, category => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  category: Category;

  @Field(type => User)
  @ManyToOne(type => User, user => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;
}
