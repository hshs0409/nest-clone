import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) // Entity만 넣어준다.
    private readonly resaturants: Repository<Restaurant>, //restaurants는 Restaurant Entity의 Repository
    private readonly categories: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.resaturants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(createRestaurantInput.categoryName);
      newRestaurant.category = category;
      await this.resaturants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: `Can't find Restaurant`,
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.resaturants.findOne(editRestaurantInput.restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: `Restaurant Not Found`,
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: `You can't edit restaurant that your own`,
        };
      }

      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(editRestaurantInput.categoryName);
      }
      await this.resaturants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Can't edit Restaurant`,
      };
    }
  }

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.resaturants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: `Restaurant Not Found`,
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: `You can't delete restaurant that your own`,
        };
      }
      await this.resaturants.delete(restaurantId);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: `Can't delete Restaurant`,
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Can't get all Categories`,
      };
    }
  }
}

/*
  typeORM function 비교

  create
  js,ts 측면에서 class를 생성하는 것 밖에 안 된다. db에는 접근 x

  save
  Entity가 없으면 삽입하고 저장한다. 있으면 Update

  update
  Entity가 있던 없던 update 해주고 없어도 Error X
  update하고 싶을때는 배열을 넣어줘야한다. save definition을 보면 entity배열이기 때문
  save에서 id를 보내주지 않을 경우 새로운 entity를 생성한다.
  id를 보내주면 typeorm이 해당 entity를 찾아 update
  */
