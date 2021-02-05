import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  // typeORM 레포지토리 inject 하려고 import 작성
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],
  providers: [RestaurantResolver, RestaurantsService],
})
export class RestaurantsModule {}
