import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //어디서나 접근가능,
      // envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test', // env 파일 경로 ( test, pord, dev )
      // ignoreEnvFile: true, // process.env.NODE_ENV === 'prod', deploy할 때 env 파일 사용하지 않는 것
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [User],
      synchronize: true, //process.env.NODE_ENV !== 'prod',
      logging: true, // process.env.NODE_ENV !== 'prod',  DB에서 돌아가는 로그 확인 prod이면 확인 x
    }),
    GraphQLModule.forRoot({
      // 해당 부분 true로 해주면 메모리에 저장, join 해주면 schema.gql 파일 생성
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      autoSchemaFile: true,
      //gql 모듈이 Query 와 Resolver를 찾는다. => Schema 생성을 위해
    }),
    UsersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

/*
dotenv의 최상위에서 실행되는 configModule 
config 패키지는 dotenv를 내부에서 사용할 수 있다. NestJS 방식으로 돌아간다.
맨 위에 ConfigModule 위치


NestJS는 아주 세련된 TypeOrm 통합시스템을 갖고 있다. Sequelize로 대체 가능 (TS인데 굳이..)
둘의 차이는 TORM은 TS기반, Sequelize은 JS 기반이라 Nest에서는 TORM이 좋다.
TypeORM 모듈 세팅은 ormconfig.js 파일을 만들어 쓰거나 직접 타이핑 두 가지

*/
