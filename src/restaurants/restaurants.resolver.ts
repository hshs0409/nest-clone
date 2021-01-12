import { Injectable } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';

// Restaurant의 Resolver
@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  // Query Decorator는 typeFunc을 받는다.
  // 쿼리가 return 하고자 하는 type을 return하는 function이어야 한다.
  // 첫 번째 arg로 function이 필요하다.

  // returns는 별 의미 x ()=> 도 상관 x
  @Query(returns => Boolean)
  isPizzaGood(): boolean {
    return true;
  }

  @Query(returns => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    //args는 gql을 위한 것 변수는 func을 위한 것 결국 필요한 것을 요청해야 한다.
    return this.restaurantsService.getAll();
  }

  //   @Mutation((returns) => Boolean)
  //   createRestaurant(
  //     @Args('name') name: string,
  //     @Args('isVegan') isVegan: boolean,
  //     @Args('address') address: string,
  //     @Args('ownerName') ownerName: string,
  //   ): boolean {
  //     return true;
  //   }

  @Mutation(returns => Boolean)
  async createRestaurant(
    @Args('iuput') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    return this.restaurantsService.createRestaurant(createRestaurantDto);
  }

  @Mutation(returns => Boolean)
  async updateRestaurant(
    @Args('iuput') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    return this.restaurantsService.updateRestaurant(updateRestaurantDto);
  }
}

// InputType은 기본적으로 Obejct 통째로 전달할 수 있도록 해준다. class 전체를 전달하는 느낌 (일종의 DTO)
// InputType이 arg로써 이름을 갖고 있지 않을 때 사용할 수 없다.
