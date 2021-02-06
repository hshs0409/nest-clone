import { Resolver, Mutation, Args, Query, ResolveField, Parent, Int } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { AllRestaurantsInput, AllRestaurantsOutput } from './dtos/allRestaurants.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { Category } from './entities/category.entity';
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

  @Query(returns => RestaurantOutput)
  restaurant(@Args('input') restaurantInput: RestaurantInput): Promise<RestaurantOutput> {
    return this.restaurantsService.findRestaurantById(restaurantInput);
  }

  @Query(returns => AllRestaurantsOutput)
  allRestaurants(
    @Args('input') allRestaurantsInput: AllRestaurantsInput,
  ): Promise<AllRestaurantsOutput> {
    return this.restaurantsService.allRestaurants(allRestaurantsInput);
  }

  @Mutation(returns => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() owner: User,
    @Args('iuput') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantsService.createRestaurant(owner, createRestaurantInput);
  }

  @Mutation(returns => EditRestaurantOutput)
  @Role(['Owner'])
  async editRestaurant(
    @AuthUser() owner: User,
    @Args('iuput') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantsService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation(returns => DeleteRestaurantOutput)
  @Role(['Owner'])
  async deleteRestaurant(
    @AuthUser() owner: User,
    @Args('iuput') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantsService.deleteRestaurant(owner, deleteRestaurantInput);
  }
}

@Resolver(of => Category)
export class CategoryResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ResolveField(type => Int)
  countRestaurants(@Parent() category: Category): Promise<number> {
    return this.restaurantsService.countRestaurants(category);
  }

  @Query(returns => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantsService.allCategories();
  }

  @Query(returns => CategoryOutput)
  findCategoryBySlug(@Args('input') categoryInput: CategoryInput): Promise<CategoryOutput> {
    return this.restaurantsService.findCategoryBySlug(categoryInput);
  }
}

// InputType은 기본적으로 Obejct 통째로 전달할 수 있도록 해준다. class 전체를 전달하는 느낌 (일종의 DTO)
// InputType이 arg로써 이름을 갖고 있지 않을 때 사용할 수 없다.
